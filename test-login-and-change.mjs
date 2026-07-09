import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ltvtaanwqrbgpngqjkmu.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_t168n4t7KEeEg6vO9vPOlg_1OJ-lkcg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: { session }, error } = await supabase.auth.signInWithPassword({
    email: 'ahmetcafoglu@hotmail.com',
    password: 'SuperAdmin2026!'
  });
  
  if (error) {
    console.error("Login failed", error.message);
    return;
  }
  
  console.log("Logged in, token:", session.access_token.substring(0, 20) + "...");
  
  const res = await fetch("http://localhost:3000/api/admin/change-password", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`
    },
    body: JSON.stringify({
        userId: "1f298db5-961d-45f1-895b-eb028bbb49ba", // pasamotor@gmail.com
        newPassword: "NewPassword123!"
    })
  });
  
  const text = await res.text();
  console.log("Response HTTP", res.status);
  console.log("Response Body:", text);
}
run();
