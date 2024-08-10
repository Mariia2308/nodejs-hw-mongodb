import Joi from 'joi';

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().required().email(),
});