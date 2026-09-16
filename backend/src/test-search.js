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

const customerMessage =
  "Where is my package? It should have arrived yesterday.";

const response = await voyage.embed({
  input: [customerMessage],
  model: "voyage-4",
  inputType: "query",
});

const queryEmbedding = response.data[0].embedding;

const results = await qdrant.search("amazonhelp", {
  vector: queryEmbedding,
  limit: 1,
  with_payload: true,
});

console.log(results);