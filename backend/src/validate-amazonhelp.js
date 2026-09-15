import fs from "fs";
import csv from "csv-parser";

let count=0
let missingCustomer =0
let missingReply = 0;
const seen = new Set();
// // read updated amazonhelp csv
  const stream = fs.createReadStream("../data/processed/amazonhelp.csv");
  stream.pipe(csv())
  .on("data",(chunk)=>{
    count++
    if(!chunk.customer_message || chunk.customer_message.trim()===""){
        missingCustomer++
    }
    if(!chunk.amazon_reply || chunk.amazon_reply.trim()===""){
        missingReply++;
    }
  })
  .on("data", (row) => {
  const key = `${row.customer_message}|||${row.amazon_reply}`;
  seen.add(key);
})
  .on("end",()=>{
    console.log(`Total interactions`,count);
      console.log("Missing customer messages:", missingCustomer);
       console.log("Missing Amazon replies:", missingReply);
       console.log("Unique interactions:", seen.size);  
  })

