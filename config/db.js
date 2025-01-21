import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error("MongoDB URI not set in environment variables");
}

export const connectWithRetry = () => {
  mongoose.connect(mongoURI)
    .then(() => console.log('Database connected'))
    .catch(() => setTimeout(connectWithRetry, 5000));  // Retry after 5 seconds
};
