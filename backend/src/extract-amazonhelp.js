import fs from "fs"
import csv from "csv-parser"
import {stringify} from "csv-stringify"

const stream = fs.createReadStream("../data/raw/twcs.csv")
const output = fs.createWriteStream("../data/processed/amazonhelp.csv")

const stringifier = stringify({
  header: true,
  columns: [
    "tweet_id",
    "author_id",
    "inbound",
    "created_at",
    "text",
    "response_tweet_id",
    "in_response_to_tweet_id"
  ]
});
stringifier.pipe(output);

stream.pipe(csv()).on("data",(chunk)=>{
   if(chunk.author_id=="AmazonHelp"){
    stringifier.write(chunk)
   }
})
.on("end",()=>{
    stringifier.end()
})
