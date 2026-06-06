import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function run() {
  const { data, error } = await supabase.from("posts").select("slug, content").order("created_at", { ascending: false }).limit(5);
  if (error) {
    console.error(error);
  } else {
    data.forEach(p => {
      console.log(`\n\n--- ${p.slug} ---`);
      console.log(p.content.substring(0, 500));
    });
  }
}
run();
