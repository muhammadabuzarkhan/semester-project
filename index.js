import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import { Food } from "./models/foodModel.js";
import foodRoute from './routes/foodRoute.js'; 
import orderRoute from "./routes/orderRoute.js";
import { authRouter } from "./controllers/authController.js";
import { auth } from "./middleware/authMiddleware.js";
import cors from "cors";
import User from "./models/user.js";
import pkg from "cloudinary";
const { v2: cloudinary } = pkg;
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { webhookRouter } from "./webhooks/webhookHandler.js";

// Load environment variables
config();

// Initialize the app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// MongoDB URI
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) throw new Error("MongoDB URI not set in environment variables");

const connectWithRetry = () => {
  mongoose.connect(mongoURI)
    .then(() => console.log('Database is connected'))
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      setTimeout(connectWithRetry, 5000);  // Retry after 5 seconds
    });
};

connectWithRetry();

// Cloudinary setup
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

// Set up routes
app.use('/food', foodRoute);
app.use('/order', orderRoute);
app.use('/auth', authRouter);
app.use('/webhooks', webhookRouter);

// Image upload route
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'images',
    allowedFormats: ['jpeg', 'png', 'jpg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const parser = multer({ storage: storage });

app.post('/upload-image', auth, parser.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.json({ secure_url: req.file.path });
});

// User profile route
app.get('/userProfile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Test route to create a user (remove in production)
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

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
