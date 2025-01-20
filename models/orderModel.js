// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//     customerEmail: { type: String, required: true},
//     orderId: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     items: [{
//         name: String,
//         quantity: Number
//     }],
//     address: {
//         line1: String,
//         line2: String,
//         city: String,
//         state: String,
//         postal_code: String,
//         country: String
//     }
// }, { timestamps: true })

// export default mongoose.model('Order', orderSchema);
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true }, // Name of the customer
    customerEmail: { type: String, required: true }, // Email of the customer
    customerPhone: { type: String, required: true }, // Phone number of the customer
    address: {
      line1: { type: String, required: true }, // Street address line 1
      line2: { type: String }, // Street address line 2 (optional)
      city: { type: String, required: true }, // City
      state: { type: String, required: true }, // State
      postal_code: { type: String, required: true }, // Postal code
      country: { type: String, required: true }, // Country
    },
    paymentMethod: { type: String, required: true }, // Payment method (e.g., "COD", "Easypaisa")
    transactionId: { type: String }, // Transaction ID (optional, for Easypaisa)
    transactionImage: { type: String }, // Transaction image (optional, for Easypaisa)
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