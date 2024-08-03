import { Types } from "mongoose";
import { getAllContacts, getContactById,upsertContact, createContact, deleteContactById } from "../services/contacts.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../pagination/paginationParams.js";
import { parseFilters } from "../utils/parseFilters.js";

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
    if(!Types.ObjectId.isValid(id)) {
        return next(createHttpError(400, 'Invalid contact id!'));
    }
    const contact = await getContactById(id);
    
    res.json({
      status: 200,
      message: `Successfully get contact with id ${id}!`,
      data: contact,
    });
};
  
export const createContactController = async (req, res) => {
    try {
        // Validate that the user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized. User ID is missing.',
            });
        }

        // Create the contact with the user ID
        const contact = await createContact(req.body, req.user._id);

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


export const patchContactController = async (req, res) => {
   try {
    const { body } = req;
    const { contactId } = req.params;
    const result = await upsertContact(contactId, body);

    if (!result.contact) {
      return res.status(404).json({
        status: 404,
        message: `Contact with id ${contactId} not found!`,
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully patched contact!`,
      data: result.contact,
    });
  } catch (error) {
    console.error('Error in patchContactController:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

export const putContactController = async (req, res) => {
  const { body } = req;
  const { contactId } = req.params;
  const { isNew, contact } = await upsertContact(contactId, body, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted contact!`,
    data: contact,
  });
};
export const deleteContactByIdController = async (req, res) => {
 const id = req.params.contactId;
  const contact = await getContactById(id);
  
  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: `Contact with id ${id} not found!`,
    });
  }
  

  await deleteContactById(id);
  
  res.status(204).send();
};