import express from 'express';
import { getChatResponse } from '../controllers/aiController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', authMiddleware, getChatResponse);

export default router;
