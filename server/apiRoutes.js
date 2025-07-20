const express = require('express');
const mongoose = require('mongoose');
const { mongoDb } = require('./db');
const { hashPassword, comparePasswords } = require('./utils/password');
const { signToken, verifyToken } = require('./utils/jwt');
const authMiddleware = require('./middleware/auth');
const { validateProfileData } = require('./utils/validation');

const router = express.Router();

// User Model
const userSchema = require('./models/User');
const User = mongoDb.model('User', userSchema);

// Profile Model
const profileSchema = require('./models/Profile');
const Profile = mongoDb.model('Profile', profileSchema);

// Photo Model
const photoSchema = require('./models/Photo');
const Photo = mongoDb.model('Photo', photoSchema);

// GET /api/hello
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

// GET /api/status
router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      username,
      password: hashedPassword
    });

    await newUser.save();

    // Create a profile for the new user
    const newProfile = new Profile({
      userId: newUser._id
    });
    await newProfile.save();

    const token = signToken({ id: newUser._id, email, username });
    res.status(201).json({ token, user: { id: newUser._id, email, username } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = signToken({ id: user._id, email: user.email, username: user.username });
    res.json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// POST /api/logout
router.post('/logout', (req, res) => {
  // Since JWT is stateless, logout is handled on client side by removing the token
  res.json({ message: 'Logged out successfully' });
});

// POST /api/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a simple reset token (in production, use a proper random token generator)
    const resetToken = Buffer.from(`${Date.now()}-${user._id}`).toString('base64');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // In a real app, send an email with the reset link
    // For simplicity, we'll just return the token in the response
    res.json({ message: 'Password reset token generated', resetToken });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error during password reset' });
  }
});

// POST /api/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error during password reset' });
  }
});

// GET /api/profile (protected route)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ user, profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
});

// PUT /api/profile (protected route for updating profile)
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    // Validate the incoming data
    const validation = validateProfileData(profileData);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Find the profile associated with the user
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      // If profile doesn't exist, create one
      profile = new Profile({ userId });
    }

    // Update profile fields if provided
    if (profileData.firstName) {
      profile.firstName = profileData.firstName;
    }
    if (profileData.lastName) {
      profile.lastName = profileData.lastName;
    }
    if (profileData.bio) {
      profile.bio = profileData.bio;
    }
    if (profileData.avatarUrl) {
      profile.avatarUrl = profileData.avatarUrl;
    }
    if (profileData.dateOfBirth) {
      profile.dateOfBirth = new Date(profileData.dateOfBirth);
    }
    if (profileData.location) {
      profile.location = profileData.location;
    }

    profile.updatedAt = Date.now();
    await profile.save();

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error while updating profile' });
  }
});

module.exports = router;
