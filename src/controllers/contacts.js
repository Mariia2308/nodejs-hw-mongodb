import { getAllContacts, getContactById, upsertContact, createContact, deleteContactById } from "../services/contacts.js";
import createHttpError from "http-errors";
export const getContactsController = async (req, res) => {
    const contacts = await getAllContacts();
    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
};

export const getContactByIdController = async (req, res) => {
    const id = req.params.contactId;
    const contact = await getContactById(id);
    
    res.json({
      status: 200,
      message: `Successfully get contact with id ${id}!`,
      data: contact,
    });
};
  
export const createContactController = async (req, res) => {
    const contact = await createContact(req.body);
    

    res.status(201).json({
        status: 201,
        message: 'Successfully created contact!',
        data: contact,
    });
};


export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await upsertContact(contactId, req.body);
    if (!result) {
        next(createHttpError(404, "Contact not found"));
        return;
    }

    res.json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result,
    });

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