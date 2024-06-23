import createHttpError from 'http-errors';
import { Contact } from '../db/models/contacts.js';

const createPaginationInfo = (page, perPage, total) => {
  const totalPages = Math.ceil(total / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    page,
    perPage,
    totalItems: total,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};


export const getAllContacts = async (
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {}
) => {
  const skip = (page - 1) * perPage;

  const ContactFilter = Contact.find();

  if (filter.isFavourite !== undefined) {
    ContactFilter.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.contactType) {
    ContactFilter.where('contactType').equals(filter.contactType);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactFilter.clone().countDocuments(),
    ContactFilter.skip(skip).limit(perPage).sort({ [sortBy]: sortOrder }).exec(),
  ]);

  const paginationInfo = createPaginationInfo(page, perPage, contactsCount);

  return {
    contacts,
    ...paginationInfo,
  };
};



export const getContactById = async (id) => {
  const contact = await Contact.findById(id);
    if (!contact) {
        throw createHttpError(404, `Contact with id ${id} not found!`);
    }
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};


export const upsertContact = async (id, payload, options = {}) => {
  try {
    const rawResult = await Contact.findByIdAndUpdate(id, payload, {
      new: true,
      upsert: true,
      ...options,
    });

    if (!rawResult) {
      throw createHttpError(404, 'Contact not found');
    }

    return {
      contact: rawResult,
      isNew: !rawResult?.lastErrorObject?.updatedExisting,
    };
  } catch (error) {
    console.error('Error in upsertContact:', error);
    throw createHttpError(500, 'Internal Server Error');
  }
};


export const deleteContactById = async (id) => {
  await Contact.findByIdAndDelete(id);
};