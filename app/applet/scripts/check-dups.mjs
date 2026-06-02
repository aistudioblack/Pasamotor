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

  // let's delete the duplicates!
  if (duplicates.length > 0) {
    console.log("Deleting duplicates...");
    const dupIds = duplicates.map(d => d.id);
    for (let i=0; i<dupIds.length; i+=50) {
      const chunk = dupIds.slice(i, i+50);
      const { error: delError } = await supabase.from('products').delete().in('id', chunk);
      if (delError) console.error("Error deleting:", delError);
    }
    console.log("Deleted duplicates.");
  }
}

run();
