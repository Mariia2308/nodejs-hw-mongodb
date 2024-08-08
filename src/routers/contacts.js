import { Router } from 'express';
import { 
  getContactsController, 
  getContactByIdController, 
  createContactController, 
  patchContactController, 
  putContactController, 
  deleteContactByIdController 
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactsSchema } from '../validationMongoDB/contacts.js';
import { updateContactsSchema } from '../validationMongoDB/contactsUpdate.js';
import { validateMongoId } from '../middlewares/validateMongoId.js';
import { authentificate } from '../middlewares/authentificate.js';

const contactRouter = Router();

contactRouter.use(authentificate);

contactRouter.get('/', ctrlWrapper(getContactsController));
contactRouter.get('/:contactId', validateMongoId('contactId'), ctrlWrapper(getContactByIdController));
contactRouter.post('/', validateBody(createContactsSchema), ctrlWrapper(createContactController));
contactRouter.patch('/:contactId', validateMongoId('contactId'), validateBody(updateContactsSchema), ctrlWrapper(patchContactController));
contactRouter.put('/:contactId', validateMongoId('contactId'), validateBody(createContactsSchema), ctrlWrapper(putContactController));
contactRouter.delete('/:contactId', validateMongoId('contactId'), ctrlWrapper(deleteContactByIdController));

export default contactRouter;
