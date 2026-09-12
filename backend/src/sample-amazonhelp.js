import fs from "fs";
import csv from "csv-parser";
import Groq from "groq-sdk";
import "dotenv/config";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const messages = [];
 const stream = fs.createReadStream("../data/processed/amazonhelp.csv");
let count = 0
 stream.pipe(csv())
 .on("data",(chunk)=>{
    if(count<1000){
   messages.push(chunk.customer_message);
      count++;
    }
 })
   .on("end", async() => {
    console.log(messages);
      const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "user",
        content: `What is the customer's problem in this message?

Customer message:
${messages[0]}`,
      },
    ],
  });
  console.log(response.choices[0].message.content);
  });



