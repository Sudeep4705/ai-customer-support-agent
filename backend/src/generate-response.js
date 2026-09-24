import { searchIntent } from "./search-intent.js";


const customerMessage = "Where is my package? It should have arrived yesterday.";
const matchedIntent = await searchIntent(customerMessage)
console.log(matchedIntent);

console.log("Customer:", customerMessage);
console.log("Intent:", matchedIntent);