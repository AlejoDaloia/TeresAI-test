import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: message,
      }),
    });

    // Leer todo como texto
    const text = await response.text();
    console.log("Respuesta cruda de Ollama:\n", text);

    // Separar en líneas y parsear cada JSON
    const lines = text.trim().split("\n");
    let finalResponse = "";

    for (let line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.response) {
          finalResponse += parsed.response;
        }
      } catch (err) {
        console.warn("No pude parsear línea:", line);
      }
    }

    res.json({ reply: finalResponse || "Ollama no devolvió respuesta." });

  } catch (error) {
    console.error("Error al conectar con Ollama:", error);
    res.status(500).json({ reply: "Error al conectar con el asistente." });
  }
});

app.listen(5000, () =>
  console.log("✅ Backend escuchando en http://localhost:5000")
);