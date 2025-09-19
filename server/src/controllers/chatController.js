import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { getAIResponse } from "../utils/aiClient.js";
import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
  try {
    const user = req.user;
    const { conversationId, message } = req.body;
    if (!message || typeof message !== "string") return res.status(400).json({ message: "Message required" });

    let conv;
    if (conversationId) {
      conv = await Conversation.findOne({ _id: conversationId, user: user._id });
      if (!conv) { // If provided conversationId is invalid or not found, try to find the user's default conversation
        conv = await Conversation.findOne({ user: user._id });
        if (!conv) {
          conv = await Conversation.create({ user: user._id, title: message.substring(0, 120) || "Conversation" });
        }
      }
    } else {
      conv = await Conversation.findOne({ user: user._id }); // Try to find the user's default conversation
      if (!conv) {
        conv = await Conversation.create({ user: user._id, title: message.substring(0, 120) || "Conversation" });
      }
    }

    const userMsg = await Message.create({
      conversation: conv._id,
      user: user._id,
      role: "user",
      content: message
    });

    const history = await Message.find({ conversation: conv._id }).sort({ createdAt: 1 }).limit(20);
    const messagesForAI = history.map(h => ({ role: h.role, content: h.content }));

    const aiText = await getAIResponse(messagesForAI);

    const aiMsg = await Message.create({
      conversation: conv._id,
      user: user._id,
      role: "assistant",
      content: aiText
    });

    if (!conv.title || conv.title === "New conversation") {
      conv.title = message.substring(0, 120);
    }
    await conv.save();

    return res.json({
      conversationId: conv._id,
      assistant: aiText,
      messages: [userMsg, aiMsg]
    });
  } catch (err) {
    console.error("sendMessage error:", err);
    return res.status(500).json({ message: "Failed to send message" });
  }
};

export const getConversations = async (req, res) => {
  try {
    let conv = await Conversation.findOne({ user: req.user._id });
    if (!conv) {
      conv = await Conversation.create({ user: req.user._id, title: "New conversation" });
    }

    const last = await Message.findOne({ conversation: conv._id }).sort({ createdAt: -1 });
    const data = {
      id: conv._id,
      title: conv.title,
      updatedAt: conv.updatedAt,
      lastMessage: last ? last.content : null
    };
    res.json({ conversations: [data] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch conversations" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    if (!mongoose.Types.ObjectId.isValid(conversationId)) return res.status(400).json({ message: "Invalid conversation id" });

    const conv = await Conversation.findOne({ _id: conversationId, user: req.user._id });
    if (!conv) return res.status(404).json({ message: "Conversation not found" });

    const messages = await Message.find({ conversation: conv._id }).sort({ createdAt: 1 });
    res.json({ conversation: { id: conv._id, title: conv.title }, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};
