import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import { Food } from "./models/foodModel.js";
import foodRoute from './routes/foodRoute.js'; 
import stripeRoute from "./routes/stripeRoute.js";
import orderRoute from "./routes/orderRoute.js";
import { authRouter } from "./controllers/authController.js";
import { auth } from "./middleware/authMiddleware.js";
import cors from "cors";
import User from "./models/user.js";
import pkg from "cloudinary"; // Import cloudinary as a package
const { v2: cloudinary } = pkg; // Destructure v2 from the package
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Stripe from "stripe";
import { webhookRouter } from "./webhooks/webhookHandler.js";

// Load environment variables from .env file
config(); 

// Initialize the app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error("MongoDB URI not set in environment variables");
}

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Database is connected'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit if DB connection fails
  });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.api.ping()
  .then(() => console.log('Cloudinary is connected'))
  .catch(err => console.error('Cloudinary connection error:', err));

// Set up routes
app.use('/stripe', stripeRoute);
app.use('/food', foodRoute);
app.use('/order', orderRoute);
app.use('/auth', authRouter);

// Image upload middleware using Cloudinary and Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'images',
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

const parser = multer({ storage: storage });

// Image upload route
app.post('/upload-image', auth, parser.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    res.json({ secure_url: req.file.path });  // This returns the image URL
  } catch (error) {
    console.error('Error during file upload: ', error);
    res.status(500).send('Internal server error');
  }
});

// User profile route 
app.get('/userProfile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Webhook route
app.use('/webhooks', webhookRouter);

// Test route to create a user
app.post('/test-user', async (req, res) => {
  try {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword',
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Start server (Vercel handles port internally)
app.listen(3000, () => {
  console.log(`Server is running`);
});

// Cloudinary async function for additional operations (optional)
(async function() {
  try {
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 
      { public_id: 'shoes' }
    );
    console.log('Upload result:', uploadResult);

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
      fetch_format: 'auto',
      quality: 'auto',
    });
    console.log('Optimized URL:', optimizeUrl);

    // Transform the image: auto-crop to square aspect ratio
    const autoCropUrl = cloudinary.url('shoes', {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });
    console.log('Auto-crop URL:', autoCropUrl);
  } catch (error) {
    console.error('Cloudinary error:', error);
  }
})();
