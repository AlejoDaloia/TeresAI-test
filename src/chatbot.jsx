import React, { useState } from "react";
import { sendMessageToOllama } from "./services/ollamaService.js";
import { systemPrompt } from "./services/prompt.js";

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", text: "¡Hola! Soy TeresAI, tu asistente." }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const fullPrompt = systemPrompt + "\nUsuario: " + input;

    const reply = await sendMessageToOllama(fullPrompt);
    const botMessage = { role: "Teresa", text: reply };

    setMessages((prev) => [...prev, botMessage]);
    setInput("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>🤖 TeresAI</h2>
      <div
        style={{
          border: "1px solid gray",
          padding: "10px",
          height: "250px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, i) => (
          <p key={i}>
            <b>{msg.role}:</b> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribí tu mensaje..."
        style={{ width: "70%", marginRight: "10px" }}
      />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
}

export default Chatbot;