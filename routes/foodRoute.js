// routes/foodRoutes.js
import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { createFood, getAllFood, deleteFood, updateFood, getFoodById } from '../controllers/foodController.js';

const router = express.Router();

// Creating a new food item
router.post('/', auth, createFood);

// Getting all food items
router.get('/', getAllFood);

// Deleting a specific food item
router.delete('/:id', auth, deleteFood);

// Updating a food item
router.put('/:id', auth, updateFood);

// Getting a specific food item
router.get('/:id', getFoodById);

export default router;
