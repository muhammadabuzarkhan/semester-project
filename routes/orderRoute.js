// import express from "express";
// import Order from "../models/orderModel.js";
// import crypto from "crypto";
// import { auth } from "../middleware/authMiddleware.js";
// import { config } from "dotenv";

// config();

// const router = express.Router();

// //fetching all the orders
// router.get('/', async (req, res) => {
//     const orders = await Order.find();

//     res.json(orders);
// })

// //fetching a single order by id
// router.get('/:id', async (req, res) => {
//     const order = await Order.findById(req.params.id);

//     res.json(order);
// })

// //updating an existing order
// router.put('/:id', auth, async (req, res) => {
//     const updateOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true});
    
//     res.json(updateOrder);
// })

// //delete an order
// router.delete('/:id', auth, async (req, res) => {
//     const deletedOrder = await Order.findByIdAndDelete(req.params.id);

//     res.json(deletedOrder);
// })

// //creating a new order
// router.post('/', async (req, res) => {
//     const orderData = req.body;

//     const orderId = crypto.createHash('sha256').update(JSON.stringify(orderData)).digest('hex');

//     try {
//         const existingOrder = await Order.findOne({ orderId });

//         if (existingOrder) {
//             return res.status(409).json({ message: 'Order already exists.' });
//         }

//         const order = new Order({ orderId, ...orderData });
//         try {
//             await order.save();
//         } catch (error) {
//             console.error('Error saving order: ', error.message);
//             return res.status(500).send({ message: 'Error saving order: ' + error.message});
//         }

//         return res.status(201).json(order);

//     } catch (error) {
//         console.error('Error finding order: ', error.message);
//         return res.status(500).send({ message: 'Error finding order: ' + error.message});
//     }
// })

// export default router;
import express from "express";
import Order from "../models/orderModel.js";
import crypto from "crypto";
import { auth } from "../middleware/authMiddleware.js"; // Make sure you have authentication middleware
import { config } from "dotenv";

config(); // Loads environment variables from .env

const router = express.Router();

// Fetching all the orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders: ", error.message);
    res.status(500).send({ message: "Error fetching orders: " + error.message });
  }
});

// Fetching a single order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id); // Find the order by ID
    if (!order) {
      return res.status(404).json({ message: "Order not found" }); // Handle if no order is found
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order: ", error.message);
    res.status(500).send({ message: "Error fetching order: " + error.message });
  }
});

// Updating an existing order (only accessible by authorized users)
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" }); // Handle if no order is found
    }
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order: ", error.message);
    res.status(500).send({ message: "Error updating order: " + error.message });
  }
});

// Deleting an order (only accessible by authorized users)
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" }); // Handle if no order is found
    }
    res.json(deletedOrder);
  } catch (error) {
    console.error("Error deleting order: ", error.message);
    res.status(500).send({ message: "Error deleting order: " + error.message });
  }
});

// Creating a new order
router.post("/", async (req, res) => {
  const orderData = req.body;

  // Generate a unique order ID using a hash of the order data (can be replaced by another method if needed)
  const orderId = crypto.createHash("sha256").update(JSON.stringify(orderData)).digest("hex");

  try {
    const existingOrder = await Order.findOne({ orderId }); // Check if an order with this ID already exists
    if (existingOrder) {
      return res.status(409).json({ message: "Order already exists." });
    }

    const order = new Order({ orderId, ...orderData }); // Create a new order instance
    await order.save(); // Save the new order in the database

    res.status(201).json(order); // Respond with the created order
  } catch (error) {
    console.error("Error creating order: ", error.message);
    res.status(500).send({ message: "Error creating order: " + error.message });
  }
});

export default router;
