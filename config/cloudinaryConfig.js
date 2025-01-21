// config/cloudinaryConfig.js
import pkg from "cloudinary";
const { v2: cloudinary } = pkg;

export const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  (async () => {
    try {
      await cloudinary.api.ping();
      console.log('Cloudinary is connected');
    } catch (error) {
      console.error('Cloudinary connection error:', error);
    }
  })();
};
