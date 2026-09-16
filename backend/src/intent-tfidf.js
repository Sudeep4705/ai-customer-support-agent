import fs from "fs";
import natural from "natural";
import csv from "csv-parser";
const tfidf = new natural.TfIdf();
const intentsData = JSON.parse(
  fs.readFileSync("../data/processed/final-intents.json", "utf8")
);

const descriptions = intentsData.intents.map(
  (intent) => intent.description
);
console.log(descriptions);


descriptions.forEach((description) => {
  tfidf.addDocument(description);
});
const amazonhelpData = [];

fs.createReadStream("../data/processed/amazonhelp.csv")
  .pipe(csv())
  .on("data", (row) => {
    amazonhelpData.push(row);
  })
  .on("end", () => {
    console.log("Total rows:", amazonhelpData.length);
    amazonhelpData.forEach((amazonhelp) => {
  tfidf.addDocument(amazonhelp.customer_message);
   
});
console.log("All customer messages added to TF-IDF");
  });

  console.log("Number of intent descriptions:", descriptions.length);







console.log("Number of intent descriptions:", descriptions.length);
