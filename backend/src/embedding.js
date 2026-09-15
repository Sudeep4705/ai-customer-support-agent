import "dotenv/config";
import { VoyageAIClient } from "voyageai";


const voyage = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY,
});

const customerMessage = "My package hasn't arrived yet.";

const response = await voyage.embed({
  input: [customerMessage],
  model: "voyage-4",
  inputType: "query",
});

console.log(response.data[0].embedding);