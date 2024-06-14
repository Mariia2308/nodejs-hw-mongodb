
import Joi from 'joi';

export const createContactsSchema = Joi.object(
  {
    name: Joi.string().min(3).max(30).required(),
    phoneNumber: Joi.string().min(3).max(30),
    email: Joi.string().email(),  
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid('work', 'home', 'personal').required(),
    createdAt: Joi.date().default(Date.now), 
    updatedAt: Joi.date().default(Date.now),  
  },
  { timestamps: true, versionKey: false }
);

