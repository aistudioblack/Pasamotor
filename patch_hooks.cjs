const fs = require('fs');
let code = fs.readFileSync('src/hooks/useMotorcycles.ts', 'utf8');

code = code.replace(
  '    images: sanitizeUrl(bike.images) || bike.images,\n    images: Array.isArray(bike.images) ? bike.images.map(img => sanitizeUrl(img) || img) : bike.images,',
  '    images: Array.isArray(bike.images) ? bike.images.map(img => sanitizeUrl(img) || img) : [sanitizeUrl(bike.images?.[0]) || bike.images?.[0]].filter(Boolean),'
);

code = code.replace(/bike\.image/g, 'bike.images');
code = code.replace(/bike\.imagess/g, 'bike.images');

fs.writeFileSync('src/hooks/useMotorcycles.ts', code);
