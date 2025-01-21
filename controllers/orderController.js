// controllers/orderController.js
import Order from "../models/orderModel.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

// Fetching all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).send({ message: "Error fetching orders: " + error.message });
  }
};

// Fetching a single order by ID
export const getOrderById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid order ID format" });
  }
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).send({ message: "Error fetching order: " + error.message });
  }
};

// Updating an order
export const updateOrder = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid order ID format" });
  }
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).send({ message: "Error updating order: " + error.message });
  }
};

// Deleting an order
export const deleteOrder = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid order ID format" });
  }
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
    res.json(deletedOrder);
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).send({ message: "Error deleting order: " + error.message });
  }
};

// Creating a new order
export const createOrder = async (req, res) => {
  try {
    const orderData = JSON.parse(req.body.orderData); // Parse the order data
    console.log("Order Data:", orderData);  // Add this for debugging purposes

    // Validate required fields
    if (!orderData.customerName || !orderData.customerEmail || !orderData.customerPhone) {
      return res.status(400).json({
        message: "customerName, customerEmail, and customerPhone are required.",
      });
    }

    // Generate unique orderId using UUID
    const orderId = uuidv4();
    console.log("Generated OrderId:", orderId);  // Add this for debugging purposes

    // Check if the orderId already exists in the database (just for safety)
    const existingOrder = await Order.findOne({ orderId });
    if (existingOrder) {
      return res.status(409).json({ message: "Order already exists with this ID." });
    }

    // Create and save the order with the new orderId
    const order = new Order({
      ...orderData,
      orderId,
      transactionImagePath: req.file ? req.file.path : null,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).send({ message: "Error creating order: " + error.message });
  }
};
