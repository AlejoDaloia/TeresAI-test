import axios from "axios";

export const sendMessageToOllama = async (message) => {
  try {
    const response = await axios.post("http://localhost:5000/api/chat", {
      message,
    });
    return response.data.reply;
  } catch (error) {
    console.error("Error con el backend:", error);
    return "No pude conectar con el asistente.";
  }
};