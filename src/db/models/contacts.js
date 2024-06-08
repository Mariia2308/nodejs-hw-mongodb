import { Schema, model } from 'mongoose';
import Joi from 'joi';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },  
    isFavourite: { type: Boolean, default: false },
    contactType: { 
      type: String, 
      required: true, 
      enum: ['work', 'home', 'personal'], 
      default: 'personal' 
    },
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now }  
  },
  { timestamps: true, versionKey: false }
);

export const Contact = model('Contact', contactSchema);
