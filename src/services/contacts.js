import { Contact } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (_id) => {
  return await Contact.findById(_id);
};
