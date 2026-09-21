  import fs from "fs";
  import natural from "natural";
  import csv from "csv-parser";
const intentTfidf = new natural.TfIdf();
const customerTfidf = new natural.TfIdf();

  const intentsData = JSON.parse(
    fs.readFileSync("../data/processed/final-intents.json", "utf8")
  );

  const descriptions = intentsData.intents.map(
    (intent) => intent.description
  );
  descriptions.forEach((description) => {
   intentTfidf.addDocument(description);
  });

  fs.createReadStream("../data/processed/amazonhelp.csv")
    .pipe(csv())
    .on("data", (row) => {
     customerTfidf.addDocument(row.customer_message);
    })
    .on("end", () => {
      console.log("All customer messages added to TF-IDF");
    });
    


    





