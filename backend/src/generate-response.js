import { searchConversation } from "./search-conversations.js";
import { searchIntent } from "./search-intent.js";


const customerMessage = "Where is my package? It should have arrived yesterday.";
const matchedIntent = await searchIntent(customerMessage)
const simillarConversation =  await searchConversation(customerMessage)
console.log(matchedIntent);

console.log("Customer:", customerMessage);
console.log("Intent:", matchedIntent);
console.log("SimillarConvo:", simillarConversation);