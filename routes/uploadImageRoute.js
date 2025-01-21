import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "cloudinary";
const { v2: cloudinaryV2 } = cloudinary;  

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2, 
  params: {
    folder: 'images',
    allowedFormats: ['jpeg', 'png', 'jpg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const parser = multer({ storage: storage });

router.post('/', auth, parser.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.json({ secure_url: req.file.path });
});

export { router as uploadImageRoute };
