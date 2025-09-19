import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { sendMessage, getConversations, getHistory } from "../controllers/chatController.js";

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/conversations", authMiddleware, getConversations);
router.get("/history/:conversationId", authMiddleware, getHistory);

export default router;