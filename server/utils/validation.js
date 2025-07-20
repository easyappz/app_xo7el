const validateProfileData = (data) => {
  const errors = {};

  if (data.firstName && typeof data.firstName !== 'string') {
    errors.firstName = 'First name must be a string';
  } else if (data.firstName && data.firstName.length > 50) {
    errors.firstName = 'First name must not exceed 50 characters';
  }

  if (data.lastName && typeof data.lastName !== 'string') {
    errors.lastName = 'Last name must be a string';
  } else if (data.lastName && data.lastName.length > 50) {
    errors.lastName = 'Last name must not exceed 50 characters';
  }

  if (data.bio && typeof data.bio !== 'string') {
    errors.bio = 'Bio must be a string';
  } else if (data.bio && data.bio.length > 500) {
    errors.bio = 'Bio must not exceed 500 characters';
  }

  if (data.avatarUrl && typeof data.avatarUrl !== 'string') {
    errors.avatarUrl = 'Avatar URL must be a string';
  }

  if (data.dateOfBirth) {
    const date = new Date(data.dateOfBirth);
    if (isNaN(date.getTime())) {
      errors.dateOfBirth = 'Invalid date of birth';
    } else if (date > new Date()) {
      errors.dateOfBirth = 'Date of birth cannot be in the future';
    }
  }

  if (data.location && typeof data.location !== 'string') {
    errors.location = 'Location must be a string';
  } else if (data.location && data.location.length > 100) {
    errors.location = 'Location must not exceed 100 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateProfileData
};
