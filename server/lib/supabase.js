const { createClient } = require("@supabase/supabase-js");
require("dotenv").config(); 

console.log("SUPABASE_URL:", process.env.SUPABASE_URL); 
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY ? "Loaded" : "Not Found");

const URL = process.env.SUPABASE_URL; 
const KEY = process.env.SUPABASE_KEY; 

if (!URL || !KEY) {
  throw new Error("Supabase URL and Key are required. Check your .env file.");
}

const supabase = createClient(URL, KEY, {
  db: { schema: "public", maxRetries: 3, timeout: 60000 }, 
});

module.exports = { supabase };