import Joi from 'joi';

// FULL NAME
const fullNameField = Joi.string().min(4).max(50).trim().messages({
  'string.empty': 'Please enter your full name',
  'string.min': 'Full name must be at least 4 characters long',
  'string.max': 'Full name cannot be longer than 50 characters',
  'any.required': 'Full name is required',
});

// EMAIL
const emailField = Joi.string().email().trim().messages({
  'string.empty': 'Please enter your email address',
  'string.email': 'Please enter a valid email address',
  'any.required': 'Email is required',
});

// PASSWORD
const passwordField = Joi.string().min(6).trim().messages({
  'string.empty': 'Please enter a password',
  'string.min': 'Password must be at least 6 characters long',
  'any.required': 'Password is required',
});

// MOBILE
const mobileField = Joi.string()
  .pattern(/^[0-9]{10}$/)
  .messages({
    'string.empty': 'Please enter your mobile number',
    'string.pattern.base': 'Mobile number must be exactly 10 digits',
    'any.required': 'Mobile number is required',
  });

// ROLE
const roleField = Joi.string().valid('user', 'vendor', 'deliveryPartner').messages({
  'string.empty': 'Please select a role',
  'any.only': 'Please select a valid role (user, vendor, or delivery partner)',
  'any.required': 'Role selection is required',
});

const otpField = Joi.string()
  .trim()
  .pattern(/^[0-9]{6}$/)
  .required()
  .messages({
    'string.empty': 'Please enter the OTP',
    'string.pattern.base': 'OTP must be exactly 6 digits',
  });

const shopNameField = Joi.string().trim().min(2).max(100).messages({
  'string.empty': 'Shop name is required',
  'string.min': 'Shop name must be at least 2 characters',
  'string.max': 'Shop name cannot exceed 100 characters',
  'any.required': 'Shop name is required',
});

const cityField = Joi.string().trim().min(2).max(60).messages({
  'string.empty': 'City is required',
  'string.min': 'City must be at least 2 characters',
  'string.max': 'City cannot exceed 60 characters',
  'any.required': 'City is required',
});

const stateField = Joi.string().trim().min(2).max(60).messages({
  'string.empty': 'State is required',
  'string.min': 'State must be at least 2 characters',
  'string.max': 'State cannot exceed 60 characters',
  'any.required': 'State is required',
});

const addressField = Joi.string().trim().min(5).max(300).messages({
  'string.empty': 'Address is required',
  'string.min': 'Address must be at least 5 characters',
  'string.max': 'Address cannot exceed 300 characters',
  'any.required': 'Address is required',
});

const imageUrlField = Joi.string()
  .uri()
  .pattern(/^https?:\/\/.+/)
  .trim()
  .messages({
    'string.uri': 'Image must be a valid URL',
  });

export {
  fullNameField,
  emailField,
  passwordField,
  mobileField,
  roleField,
  otpField,
  shopNameField,
  cityField,
  stateField,
  addressField,
  imageUrlField,
};
