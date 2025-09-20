import React, { useEffect, useRef } from "react";

export default function MessageList({ messages, userId }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-auto scrollbar-hide bg-white rounded">
      {messages.map((m, index) => (
        <div
          key={m._id || index}
          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`px-4 py-2 rounded-lg max-w-xs break-words ${
              m.role === "user"
                ? "bg-white text-gray-800 border shadow"
                : "bg-blue-600 text-white"
            }`}
          >
            {m.content}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
