import { isHttpError } from 'http-errors';


export const errorHandlerMiddleware = (error, req, res, next) => {
  if (isHttpError(error)) {
    res.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  } else if (error.name === 'ValidationError') {
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }   else {
    console.error('Unhandled error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};
