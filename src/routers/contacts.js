// src/routers/students.js

import { Router } from "express";
import { getContactsController, getContactByIdController, createContactController,patchContactController, putContactController, deleteContactByIdController  } from "../controllers/contacts.js";
import{ ctrlWrapper } from "../middlewares/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactsSchema } from "../validationMongoDB/contacts.js";
import { updateContactsSchema } from "../validationMongoDB/contactsUpdate.js";
import { authintificate } from "../middlewares/authintificate.js";
import { validateMongoId } from "../middlewares/validateMongoId.js";

const contactsRouter = Router();



contactsRouter.use('/:contactId', validateMongoId('contactId'));
//contactsRouter.use(authintificate);

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:contactId', ctrlWrapper(getContactByIdController));
contactsRouter.post('/', validateBody(createContactsSchema), ctrlWrapper(createContactController));
contactsRouter.patch('/:contactId',validateBody(updateContactsSchema), ctrlWrapper(patchContactController));
contactsRouter.put('/:contactId',validateBody(createContactsSchema), ctrlWrapper(putContactController));
contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactByIdController));
 

export default contactsRouter;
