import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

export const generateAIResponse = async (prompt) => {
  try {
    const response = await API.post("/generate", {
      prompt,
    });

    return response.data.response;

  } catch (error) {
    console.error(error);

    return "Error communicating with backend.";
  }
};