import { Food } from "../models/foodModel.js";

// Get all food items
export const getAllFood = async (req, res) => {
  try {
    const foods = await Food.find();
    // Return message and data structure as in the routes file
    res.status(200).json({
      message: 'All food items fetched successfully',
      data: foods,  // food items as data
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get a specific food item by ID
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        message: 'Food not found',
      });
    }
    res.status(200).json({
      message: 'Food item fetched successfully',
      data: food,  // Specific food item as data
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create a new food item
export const createFood = async (req, res) => {
  try {
    const { name, priceInCents, image } = req.body;
    const newFood = new Food({ name, priceInCents, image });
    await newFood.save();
    res.status(201).json({
      message: 'Food item created successfully',
      data: newFood,  // Newly created food item as data
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update a food item
export const updateFood = async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFood) {
      return res.status(404).json({
        message: 'Food not found',
      });
    }
    res.status(200).json({
      message: 'Food updated successfully',
      data: updatedFood,  // Updated food item as data
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete a food item
export const deleteFood = async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) {
      return res.status(404).json({
        message: 'Food not found',
      });
    }
    res.status(200).json({
      message: 'Food item deleted successfully',
      data: deletedFood,  // Deleted food item as data
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
