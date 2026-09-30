import express from "express"
import { generateRes } from "../generate-response"
const router = express.Router()


router.post("/chat",async(req,res)=>{
  const response =  await  generateRes()
})

export default router;