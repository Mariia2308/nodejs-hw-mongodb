import createHttpError from 'http-errors';
import { Contact } from '../db/models/contacts.js';
import { saveFile } from '../utils/saveFile.js';



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


export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
  userId,
}) => {
  const skip = (page - 1) * perPage;

  const ContactFilter = Contact.find({ userId });

  if (filter.isFavourite !== undefined) {
    ContactFilter.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.contactType) {
    ContactFilter.where('contactType').equals(filter.contactType);
  }


  //ContactFilter.where('parentId').equals(userId);

  const [contactsCount, contacts] = await Promise.all([
    ContactFilter.clone().countDocuments(),
    ContactFilter.skip(skip).limit(perPage).sort({ [sortBy]: sortOrder }).exec(),
  ]);

  const paginationInfo = createPaginationInfo(page, perPage, contactsCount);

  return {
    data:contacts,
    ...paginationInfo,
  };
};



export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({
    _id: contactId,
    userId,
  });
    if (!contact) {
        throw createHttpError(404, `Contact with id ${contactId} not found!`);
  }

  return contact;
};


export const createContact = async (payload, userId,photoUrl) => {
  const contactData = { ...payload, userId };

      if (photoUrl) {
        contactData.photo = photoUrl;
    }


  const contact = await Contact.create(contactData);

  return contact;
};


export const upsertContact = async (contactId, { photo, ...payload }, userId, options = {}) => {
  try {
    let photoUrl = '';


    if (photo) {
      photoUrl = await saveFile(photo);
    }

   
    const updateData = { ...payload };
    if (photoUrl) {
      updateData.photo = photoUrl; 
    }

    const rawResult = await Contact.findOneAndUpdate(
      {
        _id: contactId,
        userId,
      },
      updateData,
      {
        new: true,
        upsert: true,
        ...options,
      }
    );

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

export const deleteContactById = async (contactId, userId) => {
  const result = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return result;
};