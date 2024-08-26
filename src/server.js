import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VARS, UPLOAD_DIR } from './constants/index.js';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js';
import rootRouter from './routers/index.js';
import cookieParser from 'cookie-parser';
import { swagger } from './middlewares/swaggerDocs.js'; // import swagger from './middlewares/swaggerDocs.js';



export const startServer = () => {
  const app = express();

  app.use('/api-docs', swagger());

  app.use(express.json({
    limit: '10kb',
    type: ['application/json','application/vnd.api+json'],
  }));
  app.use(cors());
  app.use(cookieParser());


  //app.use(
  //  pino({
  //    transport: {
  //      target: 'pino-pretty',
  //    },
  //  }),
  //);

  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use(rootRouter);


  app.use(notFoundMiddleware);

  app.use(errorHandlerMiddleware);

  const PORT = env(ENV_VARS.PORT, 3000);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
  });
};
