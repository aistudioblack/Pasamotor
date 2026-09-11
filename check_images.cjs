const fs = require('fs');

// We have downloaded images from the live site:
const liveImages = JSON.parse(fs.readFileSync('motolux_images.json', 'utf8'));

// The app has a data file src/data/motorcycles.ts
let motorcyclesStr = fs.readFileSync('src/data/motorcycles.ts', 'utf8');

// Just extracting all imageUrl strings
const urlRegex = /"imageUrl":\s*"([^"]+)"/g;
let match;
let localImages = [];
while ((match = urlRegex.exec(motorcyclesStr)) !== null) {
  localImages.push(match[1]);
}
const urlRegex2 = /image:\s*"([^"]+)"/g;
while ((match = urlRegex2.exec(motorcyclesStr)) !== null) {
  localImages.push(match[1]);
}

console.log("Found", localImages.length, "images in motorcycles.ts");
console.log("Sample:", localImages.slice(0, 5));

// Check if they exist locally
let missing = 0;
localImages.forEach(img => {
  // if it's an absolute path starting with /images/...
  if (img.startsWith('/images/')) {
    const fullPath = 'public' + img;
    if (!fs.existsSync(fullPath)) {
      missing++;
      if (missing < 5) console.log("Missing locally:", fullPath);
    }
  }
});
console.log("Total missing locally:", missing);
