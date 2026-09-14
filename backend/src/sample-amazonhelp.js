import fs from "fs";
import csv from "csv-parser";
import Groq from "groq-sdk";
import "dotenv/config";
const resultsPath = "../data/processed/intent-discovery.json";
let allIntents = [];

if (fs.existsSync(resultsPath)) {
  const savedResults = fs.readFileSync(resultsPath, "utf8");
  allIntents = JSON.parse(savedResults);
 
}
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const messages = [];

const stream = fs.createReadStream("../data/processed/amazonhelp.csv");
let count = 0;
stream
  .pipe(csv())
  .on("data", (chunk) => {
    if (count < 1000) {
      messages.push(chunk.customer_message);
      count++;
    }
  })
  .on("end", async () => {
   
    const batchSize = 100;
     const startingIndex = allIntents.length*batchSize
    for (let i = startingIndex; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
 const prompt = `
You are analyzing customer-support messages from AmazonHelp.

Your task is to discover the main recurring customer intents in the messages below.

An intent represents the underlying reason why a customer contacted AmazonHelp.

Rules:
1. Analyze all customer messages in this batch.
2. Group messages that have the same underlying customer problem.
3. Do not create one intent for every individual message.
4. Focus on the customer's underlying problem, not the exact wording.
5. Create clear intent names using lowercase snake_case.
6. Avoid overly broad intents such as "general_issue".
7. Avoid overly specific intents that apply to only one unusual message.
8. Return no more than 10 intents.
9. Keep descriptions short and clear.
10. approximate_count should be your best estimate of how many messages in this batch belong to each intent.

Return ONLY valid JSON.

Customer messages:
${batch.join("\n")}
`;
      const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: {
  type: "json_schema",
  json_schema: {
    name: "intent_discovery",
    strict: true,
    schema: {
      type: "object",
      properties: {
        intents: {
          type: "array",
          items: {
            type: "object",
            properties: {
              intent_name: {
                type: "string"
              },
              description: {
                type: "string"
              },
              approximate_count: {
                type: "integer"
              }
            },
            required: [
              "intent_name",
              "description",
              "approximate_count"
            ],
            additionalProperties: false
          }
        }
      },
      required: ["intents"],
      additionalProperties: false
    }
  }
}
      });
      const result = response.choices[0].message.content;
      console.log("LLM RESULT:",typeof result);
      console.log("Result",result.length);
      const parseResult = JSON.parse(result)
      allIntents.push(parseResult)
      fs.writeFileSync(
  resultsPath,
  JSON.stringify(allIntents, null, 2)
);
    }
    console.log(allIntents);
  });
