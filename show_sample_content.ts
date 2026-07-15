import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!
);

async function run() {
  const { data: posts } = await supabase
    .from('posts')
    .select('title, content')
    .limit(1);
    
  if (posts && posts.length > 0) {
    console.log("Sample post title:", posts[0].title);
    console.log("Sample post content snippet:\n", posts[0].content?.substring(0, 500));
  } else {
    console.log("No posts found!");
  }
}

run();
