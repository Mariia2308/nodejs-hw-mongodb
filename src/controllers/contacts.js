import { Types } from "mongoose";
import { getAllContacts, getContactById,upsertContact, createContact, deleteContactById } from "../services/contacts.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../pagination/paginationParams.js";
import { parseFilters } from "../utils/parseFilters.js";
import { saveFile } from "../utils/saveFile.js";

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const sortBy = req.query.sortBy?.trim() || '_id';
  const sortOrder = req.query.sortOrder?.trim() || 'asc';
  const filter = parseFilters(req.query);

  try {

    filter.userId = req.user._id;

    const data = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId: req.user._id,
    });
    
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: data,
    });
  } catch (error) {
    console.error('Error in getContactsController:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

export const getContactByIdController = async (req, res, next) => {
    const id = req.params.contactId;
    const userId = req.user._id;

    if (!Types.ObjectId.isValid(id)) {
        return next(createHttpError(422, 'Invalid contact id!'));
    }

    try {
        const contact = await getContactById(id, userId);


        res.json({
            status: 200,
            message: `Successfully retrieved contact with id ${id}!`,
            data: contact,
        });
    } catch (error) {
        if (error.status && error.message) {
            return next(error);
      }
      next(createHttpError(500, 'Internal Server Error'));
    }
};
  
export const createContactController = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized. User ID is missing.',
            });
      };

       const photoUrl = req.file ? await saveFile(req.file) : null;
        const contact = await createContact(req.body, req.user._id, photoUrl);

        if (!contact) {
            return res.status(400).json({
                status: 400,
                message: 'Failed to create contact.',
            });
        }

        res.status(201).json({
            status: 201,
            message: 'Successfully created contact!',
            data: contact,
        });
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error.',
        });
    }
};


export const patchContactController = async (req, res, next) => {
  try {
    const { body, file } = req;
    const { contactId } = req.params;
    const userId = req.user._id;

    if (!contactId) {
      return next(createHttpError(400, 'Contact ID is required.'));
    }

    const payload = { ...body };
    if (file) {
      payload.photo = file;
    } else {
      delete payload.photo;
    }

    const result = await upsertContact(contactId, { ...body, photo: file }, userId);

    if (!result.contact) {
      return next(createHttpError(404, `Contact with id ${contactId} not found!`));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched contact!',
      data: result.contact,
    });
  } catch (error) {
    console.error('Error in patchContactController:', error);
    next(createHttpError(500, 'Internal Server Error'));
  }
};


export const putContactController = async (req, res) => {
  const { body } = req;
  const { contactId } = req.params;
  const userId = req.user._id; 
  
  const { isNew, contact } = await upsertContact(contactId, body, userId, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted contact!`,
    data: contact,
  });
};
export const deleteContactByIdController = async (req, res, next) => {
  const id = req.params.contactId;
  const userId = req.user._id;  

  try {
    const result = await deleteContactById(id, userId);

    if (!result) {
      return res.status(404).json({
        status: 404,
        message: `Contact with id ${id} not found!`,
      });
    }

      res.status(204).send();
  } catch (error) {
    console.error('Error in deleteContactByIdController:', error);
    next(createHttpError(500, 'Internal Server Error'));
  } 

};