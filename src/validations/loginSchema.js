
import Joi from 'joi';
export const loginUserSchema = Joi.object(
  {
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),  
  },
  { timestamps: true, versionKey: false }
);