import "dotenv/config";
import fs from "fs";
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const outputPath = "../data/processed/final-intents-candidate.json";
const resultsPath = "../data/processed/intent-discovery.json";

const savedResults = fs.readFileSync(resultsPath, "utf8");

const allBatches = JSON.parse(savedResults);

const allIntents = allBatches.flatMap(batch => batch.intents);

console.log("Total candidate intents:", allIntents.length);

const intentInput =  allIntents.map(intent => ({
    intent_name: intent.intent_name,
    description: intent.description
  }))


const prompt = `
You are designing a final customer-support intent taxonomy for AmazonHelp.

Below is a list of candidate intents discovered from multiple batches of real AmazonHelp customer messages.

Your task is to create ONE final, clean intent taxonomy from these candidates.

Rules:
1. Compare intents based on their underlying customer problem, not just their names.
2. Merge intents when they represent essentially the same customer problem, even if their names are different.
3. Keep intents separate when they represent meaningfully different customer problems.
4. Do not merge intents just because they are related. For example, requesting a refund and waiting for an already-issued refund are different problems.
5. Remove redundant or overly specific intents that do not represent a useful recurring category.
6. Keep the final taxonomy reasonably small and useful for classifying new AmazonHelp customer messages.
7. Every final intent must have a clear lowercase snake_case name.
8. Give each final intent a short description explaining the customer problem it represents.
9. Do not create new intents unless necessary to properly merge or clarify the existing candidates.
10. Return ONLY the JSON object matching the provided schema. Do not return Markdown, explanations, or tool/function calls.

Candidate intents:
${JSON.stringify(intentInput)}
`;


  const response = await groq.chat.completions.create({
  model: "openai/gpt-oss-120b",
  reasoning_effort: "low",

  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],

response_format: {
  type: "json_schema",
  json_schema: {
    name: "test_schema",
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
              }
            },
            required: ["intent_name", "description"],
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

const finalTaxonomy = JSON.parse(result);

fs.writeFileSync(
  outputPath,
  JSON.stringify(finalTaxonomy, null, 2)
);
console.log("Final intent candidates saved.");

