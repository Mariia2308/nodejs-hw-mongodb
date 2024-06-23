
import Joi from 'joi';

export const registerUserSchema = Joi.object(
  {
    name: Joi.string().min(3).max(30),
    password: Joi.string().required().min(3).max(12),
    email: Joi.string().email(),  
  },
  { timestamps: true, versionKey: false }
);

