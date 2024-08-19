import { v4 as uuidv4 } from 'uuid';  // Import UUID library
import fs from 'node:fs/promises';
import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import { ENV_VARS } from '../constants/index.js';

cloudinary.config({
  cloud_name: env(ENV_VARS.CLOUDINARY_NAME),
  api_key: env(ENV_VARS.CLOUDINARY_API_KEY),
  api_secret: env(ENV_VARS.CLOUDINARY_API_SECRET),
});

export const saveToCloudinary = async (file) => {

  const uniqueFilename = `${uuidv4()}-${file.originalname}`;


  const res = await cloudinary.uploader.upload(file.path, {
    public_id: uniqueFilename, 
  });


  await fs.unlink(file.path);

  return res.secure_url;
};
