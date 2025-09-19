import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await signup({ name, email, password });
      nav("/chat");
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to sign up");
    }
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-center bg-gray-100">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover filter brightness-50 z-0"
      >
        <source src="/robot.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 w-full max-w-md p-6 rounded shadow  bg-white/70 backdrop-blur">
        <h2 className="text-lg font-semibold mb-4 text-center">Signup</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Name (optional)"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Password"
          />
          <button className="w-full bg-green-600 text-white p-2 rounded">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
