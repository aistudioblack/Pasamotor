const fs = require('fs');

let code = fs.readFileSync('src/data/motorcycles.ts', 'utf8');

code = code.replace(/extraFeatures\?: string;/g, 'extraFeatures?: string | string[];');

fs.writeFileSync('src/data/motorcycles.ts', code);
console.log("Fixed extraFeatures array type.");
