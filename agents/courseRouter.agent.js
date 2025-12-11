import { groqClient } from "../services/groq.js";
import { handleCourseDetailQuery } from "./courseDetail.agent.js";
import { handleCourseScheduleQuery } from "./courseScheduler.agent.js";

export async function handleQuery(message) {
  const domain = await classifyQueryWithLLM(message);

  switch (domain) {
    case "courseDetail":
      return handleCourseDetailQuery(message);
    case "courseScheduler":
      return handleCourseScheduleQuery(message);
    default:
      return {
        message: "I can only provide information on course details/recommendations or course schedules.",
        fromKnowledgeBase: false,
        source: "unknown",
      };
  }
}

async function classifyQueryWithLLM(message) {
  const systemPrompt = `You are an expert classifier that classifies user queries into one of the following domains.
1. courseDetail: Queries related to course descriptions, prerequisites, units, or general "what course should I take" recommendations based on interests.
2. courseScheduler: Queries related to specific class schedules, times, days, locations, or instructors (e.g., "When is CMPE 202?", "Who teaches CMPE 272?").

Classify the following user query into one of the above domains. If the query does not fit into any of the domains, classify it as 'unknown'.

User Query: ${message}

Respond with only the domain name. Do not provide any explanations. Do not add any punctuation or formatting. Just the domain name.`;

  const res = await groqClient.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    temperature: 0,
    max_tokens: 20,
  });

  const domain = res.choices[0].message.content.trim();
  console.log(`🔍 Query: "${message}"`);
  console.log(`📊 Classified as: "${domain}"`);
  
  return domain;
}

