const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  location: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = profileSchema;
