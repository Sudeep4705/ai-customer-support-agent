import "dotenv/config"
import express from "express"
const port = process.env.PORT
const app =  express()


// SERVER
app.listen(port,()=>{
console.log(`SERVER LISTENING ON PORT ${port}`);
})