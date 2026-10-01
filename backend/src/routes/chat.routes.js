import express from "express"
import { generateRes } from "../generate-response.js"
const router = express.Router()

router.post("/chat",async(req,res)=>{
    const message  = req.body.message
  const response =  await  generateRes(message)
  return res.status(200).json(response)
})
export default router;