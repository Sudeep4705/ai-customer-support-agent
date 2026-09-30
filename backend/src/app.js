import "dotenv/config"
import express from "express"
import chatRoute from "./routes/chat.routes.js"
const port = process.env.PORT
const app =  express()


// middlewares 
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// route
app.use("/api",chatRoute)

// SERVER
app.listen(port,()=>{
console.log(`SERVER LISTENING ON PORT ${port}`);
})

