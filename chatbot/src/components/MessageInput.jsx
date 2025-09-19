import React, { useState } from "react";

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={submit} className="mt-3 flex gap-2">
      <input value={text} onChange={e => setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Ask the assistant..." disabled={disabled} />
      <button className="bg-blue-600 text-white px-4 rounded" disabled={disabled}>Send</button>
    </form>
  );
}
