import { createClient } from '@supabase/supabase-js';

async function run() {
  const sbUrl = process.env.VITE_SUPABASE_URL || '';
  const sbKey = process.env.VITE_SUPABASE_ANON_KEY || '';
  if (!sbUrl) return console.log("No supabase url");

  const supabase = createClient(sbUrl, sbKey);
  
  const { data, error } = await supabase.from('products').select('id, sku, slug, title').order('created_at', { ascending: true });
  
  if (error) {
    console.error(error);
    return;
  }
  
  console.log("Total DB Products:", data.length);
  
  const bySku = new Map();
  const duplicates = [];
  
  data.forEach(p => {
    if (bySku.has(p.sku)) {
      duplicates.push(p);
      const other = bySku.get(p.sku);
      if (duplicates.length < 5) console.log("Duplicate found:", { new: p.slug, old: other.slug, sku: p.sku });
    } else {
      bySku.set(p.sku, p);
    }
  });

  console.log("Unique SKUs:", bySku.size);
  console.log("Duplicates Count:", duplicates.length);
}

run();
