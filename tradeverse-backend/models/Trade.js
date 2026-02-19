import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  symbol: String,
  type: String,
  quantity: Number,
  price: Number,
  profitLoss: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Trade", tradeSchema);
