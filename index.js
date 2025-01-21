// server.js
import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { connectWithRetry } from "./config/db.js";
import { cloudinaryConfig } from "./config/cloudinaryConfig.js";
import foodRoute from './routes/foodRoute.js'; 
import orderRoute from "./routes/orderRoute.js";
import { webhookRouter } from "./webhooks/webhookHandler.js";
import { uploadImageRoute } from "./routes/uploadImageRoute.js";
import userRoute from './routes/userRoute.js'; // Import the new user route

config();

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// MongoDB connection
connectWithRetry();

// Cloudinary setup
cloudinaryConfig();

// Set up routes
app.use('/food', foodRoute);
app.use('/order', orderRoute);
app.use('/webhooks', webhookRouter);
app.use('/upload-image', uploadImageRoute);
app.use('/user', userRoute); 

// Export the app for Vercel to handle as a serverless function
export default app;
