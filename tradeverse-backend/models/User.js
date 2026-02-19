import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    balance: {
      type: Number,
      default: 500000,
    },
    portfolio: [
      {
        symbol: { type: String, required: true },
        quantity: { type: Number, required: true },
        avgPrice: { type: Number, required: true }
      }
    ],
    transactions: [
      {
        symbol: { type: String, required: true },
        type: { type: String, enum: ["BUY", "SELL"], required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        date: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
