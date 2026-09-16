import "dotenv/config";
import fs from "fs";
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const finalIntentPath = "../data/processed/final-intents.json"

const Intents = fs.readFileSync(finalIntentPath, "utf8");


const customerMessage = "My package hasn't arrived yet.";
const prompt = `
You are a customer support intent classifier.

Here are the available intents:
${Intents}

Customer message:${customerMessage}

Choose the single intent that best matches the customer's problem.
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
    name: "intent_classification",
    strict: true,
    schema: {
      type: "object",
      properties: {
        intent: {
          type: "string"
        }
      },
      required: ["intent"],
      additionalProperties: false
    }
  }
},
});
console.log(response.choices[0].message.content);

