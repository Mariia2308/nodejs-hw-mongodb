import { initMongoDB } from './db/initMongoDB.js';
import { startServer } from './server.js';

const bootstrap = async () => {
  try {
      await initMongoDB();
    console.log('MongoDB connected');
    startServer();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

bootstrap();
