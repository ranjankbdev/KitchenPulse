import Joi from 'joi';
import { shopNameField, cityField, stateField, addressField, imageUrlField } from './baseSchema.js';

const createShopSchema = Joi.object({
  body: Joi.object({
    name: shopNameField.required(),
    city: cityField.required(),
    state: stateField.required(),
    address: addressField.required(),
    imageUrl: imageUrlField.required(),
  }).required(),
});

const updateShopSchema = Joi.object({
  body: Joi.object({
    name: shopNameField.optional(),
    city: cityField.optional(),
    state: stateField.optional(),
    address: addressField.optional(),
    imageUrl: imageUrlField.optional(),
  })
    .min(1)
    .required(),
});

const getShopsByCitySchema = Joi.object({
  params: Joi.object({
    city: cityField.required(),
  }).required(),
});

export { createShopSchema, updateShopSchema , getShopsByCitySchema};
