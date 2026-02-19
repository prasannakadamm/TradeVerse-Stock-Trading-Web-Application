import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";


import authRoutes from "./routes/authRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // Allow frontend Vite/React
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/admin", adminRoutes);

// Start Live Price Fetcher
import priceFetcher from "./utils/priceFetcher.js";
priceFetcher(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
