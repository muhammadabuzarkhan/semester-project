// routes/orderRoutes.js
import express from "express";
import { upload } from "../middleware/fileUploadMiddleware.js"; // Assuming the multer config is in a middleware file
import { auth } from "../middleware/authMiddleware.js";
import {
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  createOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Fetching all orders
router.get("/", getAllOrders);

// Fetching a single order by ID
router.get("/:id", getOrderById);

// Updating an order
router.put("/:id", auth, updateOrder);

// Deleting an order
router.delete("/:id", auth, deleteOrder);

// Creating a new order with file upload
router.post("/", upload.single("transactionImage"), createOrder);

export default router;
