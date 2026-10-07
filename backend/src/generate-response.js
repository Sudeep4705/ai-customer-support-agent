import "dotenv/config";
import { searchConversation } from "./search-conversations.js";
import { searchIntent } from "./search-intent.js";
import Groq from "groq-sdk";


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export async function generateRes(customerMessage){
const matchedIntent = await searchIntent(customerMessage)
const simillarConversation =  await searchConversation(customerMessage)
const amazonConvo = simillarConversation.map((obj)=>({
    customer_message:obj.payload.customer_message,
    amazon_reply:obj.payload.amazon_reply
}))

// console.log("Customer:", customerMessage);
// console.log("Intent:", matchedIntent);
// console.log("SimillarConvorsation:", amazonConvo);
 
 const prompt = `
You are an Amazon customer support assistant.

Your task is to respond to the customer's current message using:
1. The customer's message
2. The detected intent
3. Similar historical Amazon customer-support conversations

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

      
