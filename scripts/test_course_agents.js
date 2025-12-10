import { handleQuery } from "../agents/courseRouter.agent.js";

async function testAgent(query) {
  console.log(`\n--- Testing Query: "${query}" ---`);
  try {
    const response = await handleQuery(query);
    console.log("Source:", response.source);
    console.log("Answer:", response.answer);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function runTests() {
  await testAgent("What is CMPE 202?");
  await testAgent("When is CMPE 202 taught?");
  await testAgent("Plan a schedule for me. I want to take 2 courses from CMPE 202, CMPE 272, and CMPE 255.");
  await testAgent("I am interested in AI and machine learning. What courses should I take?");
}

runTests();
