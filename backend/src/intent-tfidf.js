import fs from "fs";
import natural from "natural";
import csv from "csv-parser";
const tfidf = new natural.TfIdf();
const intentsData = JSON.parse(
  fs.readFileSync("../data/processed/final-intents.json", "utf8")
);
const intentTfidf = [];
const descriptions = intentsData.intents.map(
  (intent) => intent.description
);
console.log(descriptions);
descriptions.forEach((description,index) => {
  tfidf.addDocument(description);
    const terms = tfidf.listTerms(index);
  intentTfidf.push(terms);
});

const amazonhelpData = [];
const customerTfidfData = [];
fs.createReadStream("../data/processed/amazonhelp.csv")
  .pipe(csv())
  .on("data", (row) => {
    amazonhelpData.push(row);
  })
  .on("end", () => {
    console.log("Total rows:", amazonhelpData.length);
    amazonhelpData.forEach((amazonhelp,index) => {
  tfidf.addDocument(amazonhelp.customer_message);
    amazonhelpData.forEach((amazonhelp, index) => {
      const documentIndex = descriptions.length + index;
      const terms = tfidf.listTerms(documentIndex);
      customerTfidfData.push(terms);
    });
});
    console.log("this is the intents number",intentTfidf);
    console.log("this is the customerNumber:",customerTfidfData);
console.log("All customer messages added to TF-IDF");
  });
  console.log("Number of intent descriptions:", descriptions.length);





