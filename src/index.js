import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { initMongoDB } from './db/initMongoDB.js';
import { startServer } from './server.js';
import { createFolderIfDoesNotExist } from './utils/createFolderIfDoesNotExist.js';

const bootstrap = async () => {
  try {
      await initMongoDB();
    console.log('MongoDB connected');
    await createFolderIfDoesNotExist(TEMP_UPLOAD_DIR);
    await createFolderIfDoesNotExist(UPLOAD_DIR);
    startServer();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

bootstrap();
