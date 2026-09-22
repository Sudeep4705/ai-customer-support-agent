import "dotenv/config";
import { QdrantClient } from "@qdrant/js-client-rest";
import { VoyageAIClient } from "voyageai";
import fs from "fs";
const finalIntents = "../data/processed/final-intents.json"
const intents = fs.readFileSync(finalIntents,"utf8");

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const voyage = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY,
});

const allIntents = JSON.parse(intents)
console.log(allIntents);

const descriptions = allIntents.intents.map(
  (intent) => intent.description
);

console.log(descriptions);

const response = await voyage.embed({
  input: descriptions,
  model: "voyage-4",
  inputType: "document",
});

const embeddings = response.data;

const points = embeddings.map((result, index) => ({
  id: index + 1,
  vector: result.embedding,
  payload: {
    intent: allIntents.intents[index].intent,
    description: allIntents.intents[index].description,
  },
}));

await qdrant.upsert("amazonhelp", {
  wait: true,
  points,
});

console.log(`Stored ${points.length} intent embeddings in Qdrant`);