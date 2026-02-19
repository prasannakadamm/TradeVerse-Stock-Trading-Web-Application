import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["BUY", "SELL"],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Transaction", transactionSchema);
