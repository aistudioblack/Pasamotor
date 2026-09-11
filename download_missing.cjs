const axios = require('axios');
const fs = require('fs');
const path = require('path');

let motorcyclesStr = fs.readFileSync('src/data/motorcycles.ts', 'utf8');

const localImages = new Set();
const urlRegex = /"imageUrl":\s*"([^"]+)"/g;
let match;
while ((match = urlRegex.exec(motorcyclesStr)) !== null) {
  if (match[1].startsWith('/images/motorcycles/')) {
    localImages.add(match[1]);
  }
}
const urlRegex2 = /image:\s*"([^"]+)"/g;
while ((match = urlRegex2.exec(motorcyclesStr)) !== null) {
  if (match[1].startsWith('/images/motorcycles/')) {
    localImages.add(match[1]);
  }
}

const imagesToDownload = Array.from(localImages);
console.log(`Found ${imagesToDownload.length} unique images to download`);

async function downloadImage(imagePath) {
  // imagePath is like /images/motorcycles/2026/04/wow01-1.png
  const liveUrl = 'https://motolux.com.tr/wp-content/uploads/' + imagePath.replace('/images/motorcycles/', '');
  const fullPath = path.join(__dirname, 'public', imagePath);
  
  if (fs.existsSync(fullPath)) {
    // If it's too small, maybe it failed before? Let's check size
    const stat = fs.statSync(fullPath);
    if (stat.size > 1024) {
      return true; // skip already downloaded
    }
  }

  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  try {
    const response = await axios({
      url: liveUrl,
      method: 'GET',
      responseType: 'stream',
      validateStatus: status => status < 400
    });
    
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(fullPath);
      response.data.pipe(writer);
      writer.on('finish', () => resolve(true));
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`Failed ${liveUrl}: ${err.message}`);
    return false;
  }
}

async function run() {
  let successCount = 0;
  let failCount = 0;
  
  const concurrency = 10;
  const queue = [...imagesToDownload];
  
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const imgPath = queue.shift();
      const success = await downloadImage(imgPath);
      if (success) successCount++;
      else failCount++;
    }
  });
  
  await Promise.all(workers);
  console.log(`Done. Success: ${successCount}, Fail: ${failCount}`);
}

run();
