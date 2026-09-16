import "dotenv/config";
import { QdrantClient } from "@qdrant/js-client-rest";
import { VoyageAIClient } from "voyageai";
import fs from "fs";
import csv from "csv-parser";
const stream = fs.createReadStream("../data/processed/amazonhelp.csv");
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const voyage = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY,
});

let amazonhelpData = [];

stream
  .pipe(csv())
  .on("data", (chunk) => {
    amazonhelpData.push(chunk);
  })
  .on("end", async () => {
    let batchSize = 50;
    for (let i = 0; i < amazonhelpData.length; i += batchSize) {
      const batch = amazonhelpData.slice(i, i + batchSize);
      const messages = batch.map((row) => row.customer_message);
      const response = await voyage.embed({
        input: messages,
        model: "voyage-4",
        inputType: "document",
      });

      const embeddings = response.data;
console.log("Embeddings received:", embeddings.length);
console.log("Vector dimension:", embeddings[0].embedding.length);
      const points = embeddings.map((result, index) => ({
        id: i+index,
        vector: result.embedding,
        payload: {
          customer_message: batch[index].customer_message,
          amazon_reply: batch[index].amazon_reply,
        },
      }));
      await qdrant.upsert("amazonhelp", {
        wait: true,
        points
      });
      console.log("vector stored successfully!");
      console.log(`Stored ${points.length} vectors (${i + points.length}/${amazonhelpData.length})`);
    }
  });
