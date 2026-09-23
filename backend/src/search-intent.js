import "dotenv/config";
import { QdrantClient } from "@qdrant/js-client-rest";
import { VoyageAIClient } from "voyageai";

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const voyage = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY,
});

async function searchIntent(customerMessage) {
  const response = await voyage.embed({
    input: [customerMessage],
    model: "voyage-4",
    inputType: "query",
  });

const customerEmbedding = response.data[0].embedding;
const result = await qdrant.search("amazonhelp", {
  vector: customerEmbedding,
  limit: 1,
});

const matchedIntent = result[0].payload.intent;

console.log("Matched intent:", matchedIntent);


}

await searchIntent("My package hasn't arrived yet.")