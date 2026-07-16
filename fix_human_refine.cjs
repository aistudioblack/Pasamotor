const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminBlogAgent.tsx', 'utf8');

const regex = /\/\/\s*Yapay zeka izlerini temizleme\s*refined = refined\.replace[^;]+;\s*/;
const replacement = `// Yapay zeka izlerini temizleme
  refined = refined.replace(/\\*\\*([^\\*]+)\\*\\*/g, "<strong>$1</strong>");
  refined = refined.replace(/^\\s*\\*\\s/gm, "- ");
  refined = refined.replace(/\\*/g, "");
  `;

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/admin/AdminBlogAgent.tsx', code);
