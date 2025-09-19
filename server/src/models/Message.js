import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);