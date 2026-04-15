import Joi from 'joi';

import { mongoIdField, ratingField } from './baseSchema.js';

const rateItemSchema = Joi.object({
  body: Joi.object({
    itemId: mongoIdField.required(),
    orderId: mongoIdField.required(),
    rating: ratingField,
  }).required(),
});

export { rateItemSchema };
