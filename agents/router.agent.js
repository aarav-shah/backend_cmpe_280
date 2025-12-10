import {groqClient} from "../services/groq.js";
import { handleHealthQuery } from "./healthInfo.agent.js";
import { handleHealthProductQuery } from "./healthProduct.agent.js";

export async function handleQuery(message){
    const domain = await classifyQueryWithLLM(message);

    switch(domain){
        case "healthInfo":
            return handleHealthQuery(message);
        case "healthProduct":
            return handleHealthProductQuery(message);
        default:
            return { 
                message: "I can only provide information on health-related topics or suggest health products.",
                fromKnowledgeBase: false,
                source: "unknown"
            };
    }
}

async function classifyQueryWithLLM(message){
    const systemPrompt = "You are an expert classifier that classifies user queries into one of the following domains. You can smartly classify the queries based on their content. The domains are:\n1. healthInfo: Queries related to health information, tips, and advice.\n2. healthProduct: Queries related to health products, supplements, and medications.\n\nClassify the following user query into one of the above domains. If the query does not fit into any of the domains, classify it as 'unknown'.\n\nUser Query: " + message + "\n\nRespond with only the domain name. Do not provide any explanations. Do not add any punctuation or formatting. Just the domain name.";

    const res = await groqClient.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "system", content: systemPrompt },
                     { role: "user", content: message }
        ],
        temperature: 0,
        max_tokens: 20,
    }); 

    return res.choices[0].message.content.trim();
}