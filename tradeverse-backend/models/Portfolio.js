import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  avgPrice: {
    type: Number,
    required: true
  }
});

export default mongoose.model("Portfolio", portfolioSchema);
