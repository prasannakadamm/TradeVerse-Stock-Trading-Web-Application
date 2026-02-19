import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { buyStock, sellStock } from "../controllers/tradeController.js";

const router = express.Router();

router.post("/buy", authMiddleware, buyStock);
router.post("/sell", authMiddleware, sellStock);

export default router;
