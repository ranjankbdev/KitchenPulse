import Joi from 'joi';
import {
  itemNameField,
  imageUrlField,
  categoryField,
  priceField,
  foodTypeField,
  mongoIdField,
  cityField,
} from './baseSchema.js';

const createItemSchema = Joi.object({
  body: Joi.object({
    name: itemNameField.required(),
    imageUrl: imageUrlField.required(),
    category: categoryField.required(),
    price: priceField.required(),
    foodType: foodTypeField.required(),
  }).required(),
});

const updateItemSchema = Joi.object({
  params: Joi.object({
    itemId: mongoIdField.required(),
  }).required(),
  body: Joi.object({
    name: itemNameField.optional(),
    imageUrl: imageUrlField.optional(),
    category: categoryField.optional(),
    price: priceField.optional(),
    foodType: foodTypeField.optional(),
  })
    .min(1)
    .required(),
});

const itemIdSchema = Joi.object({
  params: Joi.object({
    itemId: mongoIdField.required(),
  }).required(),
});

const getItemsByCitySchema = Joi.object({
  params: Joi.object({
    city: cityField.required(),
  }).required(),
});

export { createItemSchema, updateItemSchema, itemIdSchema, getItemsByCitySchema };
