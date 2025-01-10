import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    priceInCents: {
        type: Number,
        required: true,
        min: 0, // ensures price is a non-negative value
    },
    image: {
        type: String, // URL or path to the image
        required: true,
    },
});

export const Food = mongoose.model('Food', foodSchema);
