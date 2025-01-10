import express from "express";
import { Food } from "../models/foodModel.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

// creating a new food item
router.post('/', auth, async (request, response) => {
    try {
        const { name, priceInCents, image } = request.body;

        if (!name || !priceInCents || !image) {
            return response.status(400).send({ message: 'Required fields are missing' });
        }

        const newFood = {
            name,
            priceInCents,
            image,
        };

        const food = await Food.create(newFood);

        return response.status(201).send({
            message: 'Food item created successfully',
            data: food,
        });
    } catch (error) {
        console.error(error.message);
        return response.status(500).send({ message: error.message });
    }
});

// getting all food items
router.get('/', async (request, response) => {
    try {
        const food = await Food.find({});
        return response.status(200).json({
            message: 'All food items fetched successfully',
            data: food,
        });
    } catch (error) {
        console.error(error.message);
        return response.status(500).send({ message: error.message });
    }
});

// deleting a specific food item
router.delete('/:id', auth, async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Food.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Item not found' });
        }

        return response.status(200).json({
            message: 'Item successfully deleted',
            deletedItem: result,
        });
    } catch (error) {
        console.error(error.message);
        return response.status(500).send({ message: error.message });
    }
});

// updating a food item
router.put('/:id', auth, async (request, response) => {
    try {
        const { name, priceInCents, image } = request.body;

        if (!name || !priceInCents) {
            return response.status(400).send({ message: 'Required fields are missing' });
        }

        const { id } = request.params;
        const updatedFood = await Food.findByIdAndUpdate(id, { name, priceInCents, image }, {
            new: true,
        });

        if (!updatedFood) {
            return response.status(404).json({ message: 'Food not found' });
        }

        return response.status(200).json({
            message: 'Food updated successfully',
            data: updatedFood,
        });
    } catch (error) {
        console.error(error.message);
        return response.status(500).send({ message: error.message });
    }
});

// getting a specific food item
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const food = await Food.findById(id);

        if (!food) {
            return response.status(404).json({ message: 'Food not found' });
        }

        return response.status(200).json({
            message: 'Food item fetched successfully',
            data: food,
        });
    } catch (error) {
        console.error(error.message);
        return response.status(500).send({ message: error.message });
    }
});

export default router;
