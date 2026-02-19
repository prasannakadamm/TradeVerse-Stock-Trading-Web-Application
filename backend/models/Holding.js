import mongoose from "mongoose";

const holdingSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  stock: String,
  quantity: Number,
  avgPrice: Number
});

export default mongoose.model("Holding", holdingSchema);
