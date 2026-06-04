import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

async function createBucket() {
  const sbUrl = process.env.VITE_SUPABASE_URL || "";
  // We use VITE_SUPABASE_ANON_KEY since it's the client key, but bucket creation usually requires service_role or correct policies.
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  
  if (!sbUrl || !sbKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
  }

  const supabase = createClient(sbUrl, sbKey);
  
  // We authenticate first to ensure we have privileges if RLS/Policies apply to storage
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: 'aistudioblack@gmail.com',
    password: 'PassWord123!'
  });

  if (authError) {
    console.log("Not logged in or error:", authError.message);
  } else {
    console.log("Logged in successfully as admin.");
  }

  console.log("Creating 'product-images' bucket...");
  
  const { data, error } = await supabase.storage.createBucket("product-images", {
    public: true,
    fileSizeLimit: 10485760 // 10MB
  });

  if (error) {
    if (error.message.includes('already exists') || error.message.includes('Duplicate')) {
        console.log("Bucket 'product-images' already exists.");
    } else {
        console.error("Failed to create bucket:", error.message);
    }
  } else {
    console.log("Bucket 'product-images' successfully created!", data);
  }
}

createBucket();
