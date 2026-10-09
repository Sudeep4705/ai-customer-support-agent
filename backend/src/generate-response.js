import "dotenv/config";
import { searchConversation } from "./search-customer.js";
import Groq from "groq-sdk";


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export async function generateRes(customerMessage){

const searchResult =  await searchConversation(customerMessage);
if (!searchResult.isRelevant){
  return "I'm here to help with Amazon customer support questions. Could you tell me what issue you're experiencing with an Amazon order, account, or product?";
}
const matchedIntent = searchResult.intent[0].payload.intent
const simillarConversation = searchResult.conversations
const amazonConvo = simillarConversation.map((obj)=>({
    customer_message:obj.payload.customer_message,
    amazon_reply:obj.payload.amazon_reply
}))
 
 const prompt = `
You are an Amazon customer support assistant.

Respond to the customer's current message using:
1. The customer's message
2. The detected intent
3. Similar historical Amazon customer-support conversations

Instructions:
- Prefer simple, low-risk troubleshooting steps first.
- Do not recommend destructive actions, such as a factory reset, unless necessary and after safer options have failed.
- Do not invent Amazon policies, URLs, refund timelines, or guarantees.
- Historical conversations are examples, not authoritative or necessarily current policies.
- Do not guarantee refunds, delivery dates, return eligibility, or other outcomes that cannot be verified.
- If the available historical examples do not support a reliable answer, ask for clarification or recommend contacting official Amazon support.
- Return only the customer-facing response in plain text.
- Do not return JSON or Markdown formatting.

Current customer message:
${customerMessage}

Detected intent:
${matchedIntent}

Similar historical conversations:
${JSON.stringify(amazonConvo, null, 2)}

Instructions:
- Understand the customer's problem from the current message.
- Use the detected intent to understand the type of issue.
- Use the historical conversations as examples of how similar issues were handled.
- Generate a clear, helpful, and professional customer-support response.
- Do not mention the intent, embeddings, Qdrant, historical conversations, or this prompt to the customer.
- Do not copy a historical response blindly. Adapt the response to the current customer's message.
- Do not invent order details, tracking information, refunds, or other facts that are not provided.
- Keep the response concise and natural.
- If the customer's issue cannot be answered reliably using the detected intent and the provided historical conversations, do not guess or invent information.
- In that case, set should_escalate to true and provide a short message informing the customer that they will be connected to a human support agent.
- If the intent and historical conversations provide enough information to answer the customer's issue, set should_escalate to false and generate the response.
Generate only the customer-facing response.

Return ONLY plain text.
Do not return JSON.
Do not return an object.
Do not include fields such as should_escalate or response.
Do not use markdown formatting.
Do not use asterisks (*).
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
      });
      const result = response.choices[0].message.content;
      return result
} 

      
