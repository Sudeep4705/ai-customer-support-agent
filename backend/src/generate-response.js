import { searchConversation } from "./search-conversations.js";
import { searchIntent } from "./search-intent.js";


const customerMessage = "Where is my package? It should have arrived yesterday.";
const matchedIntent = await searchIntent(customerMessage)
const simillarConversation =  await searchConversation(customerMessage)
const amazonConvo = simillarConversation.map((obj)=>({
    customerMessage:obj.payload.customer_message,
    amazon_reply:obj.payload.amazon_reply
}))
    
console.log("Customer:", customerMessage);
console.log("Intent:", matchedIntent);
console.log("SimillarConvorsation:", amazonConvo);