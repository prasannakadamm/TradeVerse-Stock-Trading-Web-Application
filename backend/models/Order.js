import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  stock: String,
  quantity: Number,
  price: Number,
  type: String, // BUY / SELL
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
