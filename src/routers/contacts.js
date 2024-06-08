// src/routers/students.js

import { Router } from "express";
import { getContactsController, getContactByIdController, createContactController,patchContactController, putContactController, deleteContactByIdController  } from "../controllers/contacts.js";
import{ ctrlWrapper } from "../middlewares/ctrlWrapper.js";

const router = Router();

  router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.post('/contacts', ctrlWrapper(createContactController));
router.patch('/contacts/:contactId', ctrlWrapper(patchContactController));
router.put('/contacts/:contactId', ctrlWrapper(putContactController));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactByIdController));
 

export default router;
