import fs from "fs";
import csv from "csv-parser";
import { stringify } from "csv-stringify";

const firststream = fs.createReadStream("../data/raw/twcs.csv");
const secondstream = fs.createReadStream("../data/raw/twcs.csv");
const output = fs.createWriteStream("../data/processed/amazonhelp.csv");

const stringifier = stringify({
  header: true,
  columns: [
    "amazon_tweet_id",
    "customer_tweet_id",
    "customer_message",
    "amazon_reply",
  ],
});

stringifier.pipe(output);

const map = new Map();

firststream
  .pipe(csv())
  .on("data", (chunk) => {
    if (chunk.author_id == "AmazonHelp") {
      map.set(chunk.tweet_id, chunk);
    }
  })
  .on("end", () => {
    console.log("first pass finished");

    const customerIds = new Set();
for (const [, amazonRow] of map) {
  customerIds.add(amazonRow.in_response_to_tweet_id);
}

const customerMap = new Map();

secondstream
  .pipe(csv())
  .on("data", (chunk) => {
    if (customerIds.has(chunk.tweet_id)) {
      customerMap.set(chunk.tweet_id, chunk); ///customer message
    }
  })
  .on("end", () => {
    console.log("second pass finished");
    
    for (const [, amazonRow] of map) {
      const customerRow = customerMap.get(amazonRow.in_response_to_tweet_id);
      if (customerRow) {
        const conversation = {
          amazon_tweet_id: amazonRow.tweet_id,
          customer_tweet_id: customerRow.tweet_id,
          customer_message: customerRow.text,
          amazon_reply: amazonRow.text,
        };
        stringifier.write(conversation);
      }
    }
    stringifier.end();
  });
  });


