import { BadRequestException } from "../exceptions/bad-request.js";
import { ErrorCodes } from "../exceptions/root.js";
import { handleQuery } from "../agents/courseRouter.agent.js";
// import { groqClient } from "../services/groq.js";
// import { getEmbedding } from "../services/jina.js";
// import { searchInQdrant } from "../services/qdrant.js";

export const chatController = async(req, res, next) => {
    const { message } = req.body;
    if (!message) {
        return next(new BadRequestException("Message is required", ErrorCodes.ALL_FIELDS_REQUIRED));
    }

    const result = await handleQuery(message);

    return res.status(200).json({
        message: result.answer,
        from_knowledge_base: result.from_knowledge_base ?? false,
        source: result.source ?? null
    });

    // const vector = await getEmbedding(message);

    // const searchResults = await searchInQdrant("HealthTips", vector);

    // const context = searchResults.map(result => `${result.payload.title}:${result.payload.content}`).join("\n\n");

    // const fullMessage = `You are a helpful assistant for health, you only answer health related queries, if asked anything else you respond with "I can only provide information on health-related topics." Use the following context to answer the question.\n\nContext:\n${context}\n\nQuestion: ${message}`;

    // const response = await groqClient.chat.completions.create({
    //     model: "openai/gpt-oss-20b",
    //     messages: [{ role: "user", content: fullMessage }],
    //     temperature: 0.4,
    //     max_tokens: 1000,
    // });

    // return res.status(200).json({ reply: response.choices[0].message.content });
}