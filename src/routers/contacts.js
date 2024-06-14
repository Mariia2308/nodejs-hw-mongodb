// src/routers/students.js

import { Router } from "express";
import { getContactsController, getContactByIdController, createContactController,patchContactController, putContactController, deleteContactByIdController  } from "../controllers/contacts.js";
import{ ctrlWrapper } from "../middlewares/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactsSchema } from "../validationMongoDB/contacts.js";
import { updateContactsSchema } from "../validationMongoDB/contactsUpdate.js";
const router = Router();

  router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.post('/contacts', validateBody(createContactsSchema), ctrlWrapper(createContactController));
router.patch('/contacts/:contactId',validateBody(updateContactsSchema), ctrlWrapper(patchContactController));
router.put('/contacts/:contactId',validateBody(createContactsSchema), ctrlWrapper(putContactController));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactByIdController));
 

export default router;
