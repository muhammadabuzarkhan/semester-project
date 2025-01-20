import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true }, // Add orderId as required and unique
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String },
    transactionImage: { type: String },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Referencing Product model (assuming you have one)
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
