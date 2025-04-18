const { supabase } = require("./supabase");

(async () => {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) console.log("Error:", error.message);
  else console.log("Buckets:", data);
})();
