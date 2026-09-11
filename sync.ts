import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { MOTORCYCLES } from './src/data/motorcycles.js';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function sync() {
  const { data: existing } = await supabase.from('site_content').select('id').eq('page_key', 'motorcycles_catalog').single();
  
  if (existing) {
    const { error } = await supabase.from('site_content').update({
      sections: MOTORCYCLES,
      updated_at: new Date().toISOString()
    }).eq('id', existing.id);
    if (error) console.error("Error updating:", error);
    else console.log("Successfully updated.");
  } else {
    const { error } = await supabase.from('site_content').insert({
      page_key: 'motorcycles_catalog',
      sections: MOTORCYCLES,
      updated_at: new Date().toISOString()
    });
    if (error) console.error("Error inserting:", error);
    else console.log("Successfully inserted.");
  }
}

sync();
