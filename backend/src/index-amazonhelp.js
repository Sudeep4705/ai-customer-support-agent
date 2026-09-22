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

console.log("Number of embeddings:", embeddings.length);
console.log("First embedding:", embeddings[0].embedding);
console.log("Vector dimension:", embeddings[0].embedding.length);
