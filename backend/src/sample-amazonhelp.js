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
    const batchSize = 100
for(let i=0;i<messages.length;i+=batchSize){
  const batch = messages.slice(i,i+batchSize)
   console.log("Batch size:", batch.length);

   const prompt =  `
You are analyzing customer-support messages from AmazonHelp.

Your task is to identify the recurring types of problems customers are asking AmazonHelp about.

Analyze all the customer messages below and group messages that represent the same underlying customer problem.

Rules:
1. Focus only on the customer's problem or reason for contacting support.
2. Do not generate replies to customers.
3. Do not create one intent for every message.
4. Combine messages that have the same underlying problem.
5. Create clear, specific intent names.
6. Avoid intents that are too broad.
7. Avoid intents that are unnecessarily specific.
8. If a problem appears only once, include it only if it represents a meaningful distinct support issue.

Return ONLY valid JSON in this exact structure:

{
  "intents": [
    {
      "intent_name": "intent_name_here",
      "description": "description of the underlying customer problem",
      "examples": [
        "example customer message",
        "example customer message"
      ],
      "approximate_count": 0
    }
  ]
}

Do not return Markdown.
Do not use a Markdown code block.
Do not include any explanation before or after the JSON.

Customer messages:

${batch.join("\n")}
`
      const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  console.log(response.choices[0].message.content);
  
}


  });



