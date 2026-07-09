import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://ltvtaanwqrbgpngqjkmu.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
);

async function run() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  console.log("users table:", error ? error.message : "Exists");
}
run();
