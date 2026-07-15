import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!
);

async function run() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug');
    
  if (error) {
    console.error("Error fetching posts:", error);
    return;
  }
  
  console.log(`Found ${posts?.length} posts:`);
  posts?.forEach((p, idx) => {
    console.log(`${idx + 1}. Title: "${p.title}" | Slug: "${p.slug}"`);
  });
}

run();
