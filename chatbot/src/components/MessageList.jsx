import React, { useEffect, useRef } from "react";

export default function MessageList({ messages }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  return (
    <div ref={ref} className="flex-1 p-4 overflow-auto scrollbar-hide bg-white rounded">
      {messages.map((m) => (
        <div
          key={m._id}
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
    </div>
  );
}
