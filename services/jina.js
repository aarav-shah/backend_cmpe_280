import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const JINA_API_URL = "https://api.jina.ai/v1/embeddings";
const JINA_API_KEY = process.env.JINA_API_KEY;

export async function getJinaEmbeddings(input, model = "jina-embeddings-v3", task = "text-matching") {
  const data = {
    model,
    task,
    input: Array.isArray(input) ? input : [input],
  };

  try {
    const response = await axios.post(JINA_API_URL, data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JINA_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getEmbedding(text) {
  const res = await getJinaEmbeddings(text);
  return Array.from(res.data[0].embedding);
}