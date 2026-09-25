import "dotenv/config";
import fs from "fs";
import csv from "csv-parser";
import { QdrantClient } from "@qdrant/js-client-rest";
import { VoyageAIClient } from "voyageai";

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const voyage = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY,
});
const customerMessages = [];

const stream = fs.createReadStream("../data/processed/amazonhelp.csv");
let count = 0;
stream
  .pipe(csv())
  .on("data", (chunk) => {
    if (count < 1000) {
customerMessages.push({
  customer_message: chunk.customer_message,
  amazon_reply: chunk.amazon_reply,
});
      count++;
    }
  })
  .on("end",async()=>{
console.log(customerMessages.length);
const batchSize = 50;
for (let i = 0; i < customerMessages.length; i += batchSize) {
  const batch = customerMessages.slice(i, i + batchSize);
  const messagesForEmbedding = batch.map(
  (row) => row.customer_message
);
  const response = await voyage.embed({
    input: messagesForEmbedding,
    model: "voyage-4",
    inputType: "document",
  });
  if((i+50 < customerMessages.length)){
    await new Promise((resolve)=>setTimeout(resolve,21000))
  }
const embeddings = response.data;

const points = embeddings.map((result, index) => ({
  id: i + index + 1,
  vector: result.embedding,
  payload: {
    customer_message: batch[index].customer_message,
    amazon_reply: batch[index].amazon_reply,
  },
}));

await qdrant.upsert("amazon-conversation", {
  wait: true,
  points,
});
  
}
  })