import Joi from 'joi';
import {
  mongoIdField,
  cartItemField,
  deliveryAddressField,
  paymentMethodField,
  orderStatusField,
} from './baseSchema.js';

const createOrderSchema = Joi.object({
  body: Joi.object({
    cartItems: Joi.array().items(cartItemField).min(1).required().messages({
      'array.min': 'Cart cannot be empty',
      'any.required': 'Cart items are required',
    }),
    paymentMethod: paymentMethodField.required(),
    deliveryAddress: deliveryAddressField.required(),
  }).required(),
});

const updateShopOrderStatusSchema = Joi.object({
  params: Joi.object({
    orderId: mongoIdField.required(),
    shopId: mongoIdField.required(),
  }).required(),
  body: Joi.object({
    status: orderStatusField.required(),
  }).required(),
});

const assignmentIdSchema = Joi.object({
  params: Joi.object({
    assignmentId: mongoIdField.required(),
  }).required(),
});

const orderIdSchema = Joi.object({
  params: Joi.object({
    orderId: mongoIdField.required(),
  }).required(),
});

export { createOrderSchema, updateShopOrderStatusSchema, assignmentIdSchema, orderIdSchema };
