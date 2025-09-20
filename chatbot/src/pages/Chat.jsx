import React, { useState, useEffect, useContext } from "react";
import api from "../service/api";
import { AuthContext } from "../context/AuthContext";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [typing, setTyping] = useState(false);

  const loadConversation = async () => {
    setLoadingConvs(true);
    try {
      const resp = await api.get("/chat/conversations");
      if (resp.data.conversations.length > 0) {
        setConversation(resp.data.conversations[0]);
        loadHistory(resp.data.conversations[0].id);
      } else {
        // If no conversations exist, create a new one
        const newConvResp = await api.post("/chat/new");
        setConversation(newConvResp.data.conversation);
        loadHistory(newConvResp.data.conversation._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConvs(false);
    }
  };

  const loadHistory = async (convId) => {
    if (!convId) {
      setMessages([]);
      return;
    }
    try {
      const r = await api.get(`/chat/history/${convId}`);
      setMessages(r.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) loadConversation();
  }, [user]);

  const handleSend = async (text) => {
    setTyping(true);
    try {
      const resp = await api.post("/chat/send", {
        conversationId: conversation.id,
        message: text,
      });
      setMessages((prev) => [...prev, ...resp.data.messages]);
    } catch (err) {
      console.error("send error", err);
      alert(err?.response?.data?.message || "Send failed");
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-gray-100 p-4">
      <div className="flex-1 overflow-y-auto mb-2">
        <MessageList messages={messages} userId={user?.id} />
      </div>

      {typing && (
        <div className="text-sm text-gray-500 mb-2">Assistant is typing...</div>
      )}

      <MessageInput onSend={handleSend} disabled={typing || !conversation} />
    </div>
  );
}
