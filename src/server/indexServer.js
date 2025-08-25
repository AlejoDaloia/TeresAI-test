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

    // Obtener respuesta como texto
    const text = await response.text();
    console.log("Respuesta cruda de Ollama:", text);

    // Intentar parsear JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.warn("No se pudo parsear JSON de Ollama, enviando mensaje por defecto.");
      data = { response: "No pude interpretar la respuesta del asistente." };
    }

    // Enviar respuesta al frontend
    res.json({ reply: data.response || "Ollama no devolvió respuesta." });

  } catch (error) {
    console.error("Error al conectar con Ollama:", error);
    res.status(500).json({ reply: "Error al conectar con el asistente." });
  }
});

app.listen(5000, () => console.log("✅ Backend escuchando en http://localhost:5000"));