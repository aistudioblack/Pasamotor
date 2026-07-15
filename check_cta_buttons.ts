import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!
);

async function run() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, content');
    
  if (error) {
    console.error("Error fetching posts:", error);
    return;
  }
  
  console.log("Checking blog posts content for potential CTA elements, custom HTML tags, or buttons...");
  for (const post of posts || []) {
    const ctas = [];
    const content = post.content || "";
    
    // Check for common button patterns in Markdown/HTML
    // e.g. class="btn", [CTA text](url), custom HTML tags, wait, what about specific markdown links or colors?
    if (content.includes("bg-") || content.includes("button") || content.includes("cta") || content.includes("btn") || content.includes("class=")) {
      // Find classes or patterns
      const matches = content.match(/class="[^"]*"/g) || [];
      ctas.push(...matches);
    }
    
    if (ctas.length > 0) {
      console.log(`\nPost: "${post.title}"`);
      console.log(`Found classes:`, Array.from(new Set(ctas)));
    }
  }
}

run();
