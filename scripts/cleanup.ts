import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ltvtaanwqrbgpngqjkmu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDuplicates() {
  console.log("Starting duplicate cleanup...");
  
  // Clean products based on slug
  console.log("Checking products...");
  const { data: products } = await supabase.from('products').select('id, slug, title');
  if (products) {
    const slugMap = new Map();
    const toDelete: string[] = [];
    for (const p of products) {
      if (!p.slug) continue;
      if (slugMap.has(p.slug)) {
        toDelete.push(p.id);
      } else {
        slugMap.set(p.slug, true);
      }
    }
    if (toDelete.length > 0) {
      console.log(`Found ${toDelete.length} duplicate products. Deleting...`);
      // Delete in chunks of 100
      for (let i = 0; i < toDelete.length; i += 100) {
        const chunk = toDelete.slice(i, i + 100);
        await supabase.from('products').delete().in('id', chunk);
      }
      console.log(`Deleted ${toDelete.length} duplicate products.`);
    } else {
      console.log("No duplicate products found by slug.");
    }
  }

  // Clean posts based on slug
  console.log("Checking posts...");
  const { data: posts } = await supabase.from('posts').select('id, slug');
  if (posts) {
    const slugMap = new Map();
    const toDelete: string[] = [];
    for (const p of posts) {
      if (!p.slug) continue;
      if (slugMap.has(p.slug)) {
        toDelete.push(p.id);
      } else {
        slugMap.set(p.slug, true);
      }
    }
    if (toDelete.length > 0) {
      console.log(`Found ${toDelete.length} duplicate posts. Deleting...`);
      for (let i = 0; i < toDelete.length; i += 100) {
        const chunk = toDelete.slice(i, i + 100);
        await supabase.from('posts').delete().in('id', chunk);
      }
    } else {
      console.log("No duplicate posts found.");
    }
  }

  // Clean pages based on slug
  console.log("Checking pages...");
  const { data: pages } = await supabase.from('pages').select('id, slug');
  if (pages) {
    const slugMap = new Map();
    const toDelete: string[] = [];
    for (const p of pages) {
      if (!p.slug) continue;
      if (slugMap.has(p.slug)) {
        toDelete.push(p.id);
      } else {
        slugMap.set(p.slug, true);
      }
    }
    if (toDelete.length > 0) {
      console.log(`Found ${toDelete.length} duplicate pages. Deleting...`);
      for (let i = 0; i < toDelete.length; i += 100) {
        const chunk = toDelete.slice(i, i + 100);
        await supabase.from('pages').delete().in('id', chunk);
      }
    } else {
      console.log("No duplicate pages found.");
    }
  }
  
  // Clean site_content based on page_key
  console.log("Checking site_content...");
  const { data: site_content } = await supabase.from('site_content').select('id, page_key');
  if (site_content) {
    const slugMap = new Map();
    const toDelete: string[] = [];
    for (const p of site_content) {
      if (!p.page_key) continue;
      if (slugMap.has(p.page_key)) {
        toDelete.push(p.id);
      } else {
        slugMap.set(p.page_key, true);
      }
    }
    if (toDelete.length > 0) {
      console.log(`Found ${toDelete.length} duplicate site_contents. Deleting...`);
      for (let i = 0; i < toDelete.length; i += 100) {
        const chunk = toDelete.slice(i, i + 100);
        await supabase.from('site_content').delete().in('id', chunk);
      }
    } else {
      console.log("No duplicate site_content found.");
    }
  }

  // Clean faqs based on question
  console.log("Checking faqs...");
  const { data: faqs } = await supabase.from('faqs').select('id, question');
  if (faqs) {
    const slugMap = new Map();
    const toDelete: string[] = [];
    for (const p of faqs) {
      if (!p.question) continue;
      if (slugMap.has(p.question)) {
        toDelete.push(p.id);
      } else {
        slugMap.set(p.question, true);
      }
    }
    if (toDelete.length > 0) {
      console.log(`Found ${toDelete.length} duplicate faqs. Deleting...`);
      for (let i = 0; i < toDelete.length; i += 100) {
        const chunk = toDelete.slice(i, i + 100);
        await supabase.from('faqs').delete().in('id', chunk);
      }
    } else {
      console.log("No duplicate faqs found.");
    }
  }

  console.log("Cleanup complete!");
  process.exit(0);
}

cleanupDuplicates();
