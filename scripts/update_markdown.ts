import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { marked } from "marked";

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function run() {
  const { data: posts } = await supabase.from("posts").select("id, slug, content").order("created_at", { ascending: false });
  
  if (!posts) return;
  
  for (const post of posts) {
    if (post.content.includes("## ") || post.content.includes("### ") || post.content.match(/^#/m)) {
        console.log(`Processing: ${post.slug}`);
        
        let markdownContent = post.content;
        markdownContent = markdownContent.replace(/^# .*?\n+/i, "");
        
        const html = await marked.parse(markdownContent);
        
        const { error: updateErr } = await supabase.from("posts").update({ content: html.toString() }).eq("id", post.id);
        if (updateErr) {
            console.error(`Failed to update ${post.slug}`, updateErr);
        } else {
            console.log(`Successfully updated ${post.slug}`);
        }
    } else {
        console.log(`Skipping ${post.slug}`);
    }
  }
}

run();
