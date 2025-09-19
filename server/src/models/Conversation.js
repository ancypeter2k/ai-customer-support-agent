import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "New conversation" },
}, { timestamps: true });

export default mongoose.model("Conversation", conversationSchema);
