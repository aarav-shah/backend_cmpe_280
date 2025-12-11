import { getEmbedding } from "../services/jina.js";
import { groqClient } from "../services/groq.js";
import { searchInQdrant } from "../services/qdrant.js";

export async function handleCourseDetailQuery(message) {
  const vector = await getEmbedding(message);
  const results = await searchInQdrant("CourseDetails", vector);

  const context = results
    .map((r) => `${r.payload.code} - ${r.payload.title}: ${r.payload.description} (Units: ${r.payload.units}, Prerequisites: ${r.payload.prerequisites.join(", ")})`)
    .join("\n\n");

  const prompt = `
You are a helpful and knowledgeable academic advisor agent named "courseDetail".

Rules:
- You have access to a list of courses with their descriptions and prerequisites.
- If the user asks about a specific course, provide details from the knowledge base.
- If the user describes their interests (e.g., "I like AI", "I want to learn web dev"), RECOMMEND courses from the knowledge base that match those interests.
- Always explain WHY a recommended course fits their interest.
- If the knowledge base does not contain relevant courses, politely say so.
- Do not invent courses.

Knowledge Base:
${context}

User Query: ${message}
`.trim();

  const response = await groqClient.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 1000,
    stream: false,
  });

  return {
    answer: response.choices[0].message.content,
    from_knowledge_base: true,
    source: "courseDetail",
  };
}
