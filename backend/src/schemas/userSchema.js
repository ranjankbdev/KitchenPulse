import Joi from 'joi';
import { latitudeField, longitudeField } from './baseSchema.js';

const updateCurrentLocationSchema = Joi.object({
  body: Joi.object({
    latitude: latitudeField,
    longitude: longitudeField,
  }).required(),
});

export { updateCurrentLocationSchema };
