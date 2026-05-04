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

const imageUrlField = Joi.string().uri().trim().messages({
  'string.uri': 'Image must be a valid URL',
});

const itemNameField = Joi.string().trim().min(2).max(120).messages({
  'string.empty': 'Item name is required',
  'string.min': 'Item name must be at least 2 characters',
  'string.max': 'Item name cannot exceed 120 characters',
  'any.required': 'Item name is required',
});

const categoryField = Joi.string()
  .valid('snacks', 'main_course', 'desserts', 'beverages', 'fast_food', 'others')
  .messages({
    'any.only': 'Please select a valid category',
    'string.empty': 'Category is required',
    'any.required': 'Category is required',
  });

const priceField = Joi.number().min(0).messages({
  'number.base': 'Price must be a number',
  'number.min': 'Price cannot be negative',
  'any.required': 'Price is required',
});

const foodTypeField = Joi.string().valid('veg', 'non-veg').messages({
  'any.only': 'Food type must be veg or non-veg',
  'string.empty': 'Food type is required',
  'any.required': 'Food type is required',
});

const mongoIdField = Joi.string()
  .pattern(/^[a-fA-F0-9]{24}$/)
  .messages({
    'string.pattern.base': 'Invalid ID format',
    'any.required': 'ID is required',
  });

const cartItemField = Joi.object({
  _id: mongoIdField.required(),
  shop: mongoIdField.required(),
  quantity: Joi.number().min(1).required().messages({
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required',
  }),
});

const deliveryAddressField = Joi.object({
  text: addressField.required(),
  latitude: Joi.number().required().messages({
    'any.required': 'Latitude is required',
  }),
  longitude: Joi.number().required().messages({
    'any.required': 'Longitude is required',
  }),
}).messages({
  'any.required': 'Delivery address is required',
  'object.base': 'Delivery address must be an object',
});

const paymentMethodField = Joi.string().valid('cod', 'online').messages({
  'any.only': 'Payment method must be cod or online',
  'any.required': 'Payment method is required',
});

const orderStatusField = Joi.string()
  .valid('pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered')
  .messages({
    'any.only': 'Invalid order status',
    'any.required': 'Status is required',
  });

const latitudeField = Joi.number().min(-90).max(90).required().messages({
  'number.base': 'Latitude must be a number',
  'number.min': 'Latitude must be >= -90',
  'number.max': 'Latitude must be <= 90',
  'any.required': 'Latitude is required',
});

const longitudeField = Joi.number().min(-180).max(180).required().messages({
  'number.base': 'Longitude must be a number',
  'number.min': 'Longitude must be >= -180',
  'number.max': 'Longitude must be <= 180',
  'any.required': 'Longitude is required',
});

const searchQueryField = Joi.string().trim().min(1).max(100).messages({
  'string.empty': 'Search query is required',
  'string.min': 'Search query must be at least 1 character',
  'string.max': 'Search query cannot exceed 100 characters',
  'any.required': 'Search query is required',
});

const razorpayPaymentIdField = Joi.string().trim().messages({
  'string.empty': 'Payment ID is required',
  'any.required': 'Payment ID is required',
});

const razorpayOrderIdField = Joi.string().trim().messages({
  'string.empty': 'Razorpay order ID is required',
  'any.required': 'Razorpay order ID is required',
});

const razorpaySignatureField = Joi.string().trim().messages({
  'string.empty': 'Payment signature is required',
  'any.required': 'Payment signature is required',
});

const ratingField = Joi.number().integer().min(1).max(5).required().messages({
  'number.base': 'Rating must be a number',
  'number.integer': 'Rating must be a whole number',
  'number.min': 'Rating must be at least 1',
  'number.max': 'Rating cannot exceed 5',
  'any.required': 'Rating is required',
});

const descriptionField = Joi.string().trim().max(120).allow('').messages({
  'string.max': 'Description cannot exceed 120 characters',
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
  itemNameField,
  categoryField,
  priceField,
  foodTypeField,
  mongoIdField,
  cartItemField,
  deliveryAddressField,
  paymentMethodField,
  orderStatusField,
  latitudeField,
  longitudeField,
  searchQueryField,
  razorpayOrderIdField,
  razorpayPaymentIdField,
  razorpaySignatureField,
  ratingField,
  descriptionField,
};
