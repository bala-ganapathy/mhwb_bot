// ✅ Updated App.js
import React, { useState, useEffect } from "react";
import { sendMessage, fetchHistory } from "./api";
import "./App.css";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || "");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!userId);

  useEffect(() => {
    if (userId) {
      localStorage.setItem("user_id", userId);
      fetchHistory(userId).then((data) => setMessages(data.messages || []));
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !userId) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const result = await sendMessage(userId, input);
    setMessages((prev) => [...prev, { sender: "assistant", text: result.reply }]);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Welcome to MindCare 🌿</h2>
          <input
            className="login-input"
            placeholder="Enter user ID or type 'new'"
            onChange={(e) => setUserId(e.target.value.trim())}
          />
          <button className="login-btn" onClick={() => setIsLoggedIn(true)}>Start Chat</button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <h1 className="title">MindCare Assistant 💬</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>{msg.text}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;