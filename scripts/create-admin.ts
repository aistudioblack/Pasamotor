import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ltvtaanwqrbgpngqjkmu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupUser(email: string, roleParam: string, passwordOverride?: string) {
  console.log(`\nSetting up user: ${email} as ${roleParam}...`);
  const password = passwordOverride || "PassWord123!"; // Default fallback if creating new.

  // Try to create the user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) {
    if (authError.message.includes('User already created') || authError.message.includes('already exists') || authError.message.includes('already been registered')) {
        console.log(`User ${email} already exists in auth.`);
    } else {
        console.error("Auth Error:", authError);
    }
  }

  // Fetch the user
  const { data: userList } = await supabase.auth.admin.listUsers();
  const userToUse = userList?.users.find((u: any) => u.email === email);

  if (!userToUse) {
    console.error(`User ${email} not found after creation attempt.`);
    return;
  }
  
  if (authError && (authError.message.includes('User already created') || authError.message.includes('already exists') || authError.message.includes('already been registered'))) {
    // Attempt to update password to ensure they can login
    await supabase.auth.admin.updateUserById(userToUse.id, { password });
    console.log(`Ensured password is: ${password}`);
  }

  // Insert into public.users
  const { error: insertUserError } = await supabase.from('users').upsert({
    id: userToUse.id,
    email: userToUse.email,
    role: roleParam,
    created_at: new Date().toISOString()
  });

  if (insertUserError) {
      console.log(`Could not insert ${email} into users table:`, insertUserError);
  } else {
      console.log(`Successfully inserted ${email} into users table with role: ${roleParam}.`);
  }

  // Also insert into user_roles
  const { error: insertRoleError } = await supabase.from('user_roles').upsert({
    user_id: userToUse.id,
    role: roleParam
  });
  
  if (insertRoleError) {
      console.log(`Could not insert ${email} into user_roles table:`, insertRoleError);
  } else {
      console.log(`Successfully inserted ${email} into user_roles table with role: ${roleParam}.`);
  }
  
  // Ensure they also have the 'admin' role if they are super_admin, because has_role might explicitly check 'admin'
  if (roleParam === 'super_admin') {
    await supabase.from('user_roles').upsert({
      user_id: userToUse.id,
      role: 'admin'
    });
  }

  console.log(`Account is ready: Email: ${email} | Password: ${password}\n`);
}

async function run() {
  await setupUser("ahmetcafoglu@hotmail.com", "admin", "Ahmet844_");
  await setupUser("pasamotor@gmail.com", "admin", "PasaMotor2026!");
  process.exit(0);
}

run();
