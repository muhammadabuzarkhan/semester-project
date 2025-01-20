import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
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
        name: { type: String, required: true }, // Name of the product
        quantity: { type: Number, required: true }, // Quantity of the product
        price: { type: Number, required: true }, // Price of the product (in cents or dollars)
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Order", orderSchema);