import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getPortfolio } from "../controllers/portfolioController.js";

const router = express.Router();

router.get("/", authMiddleware, getPortfolio);

export default router;
