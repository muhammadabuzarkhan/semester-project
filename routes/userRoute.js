// routes/authRoute.js
import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/authController.js"; 
import { auth } from "../middleware/authMiddleware.js"; // Import auth middleware

const router = express.Router();

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route for getting user profile (protected by auth middleware)
router.get("/profile", auth, getUserProfile);

export default router;
