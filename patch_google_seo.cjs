const fs = require('fs');
let code = fs.readFileSync('src/components/admin/GoogleSeoDashboard.tsx', 'utf8');
code = code.replace(
  /const \{ adminFetch \} = await import\("@\/lib\/api-client"\);\s*\.eq\('page_key', 'google_oauth_settings'\)\s*\.maybeSingle\(\);\s*if \(data && data\.sections\) \{/m,
  `const { adminFetch } = await import("@/lib/api-client");
          const response = await adminFetch("/api/admin/site-content/google_oauth_settings");
          const data = response.ok ? await response.json() : null;
          if (data && data.sections) {`
);
fs.writeFileSync('src/components/admin/GoogleSeoDashboard.tsx', code);
