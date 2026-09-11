const axios = require('axios');
const fs = require('fs');
const path = require('path');

const images = JSON.parse(fs.readFileSync('motolux_images.json', 'utf8'));

async function downloadImage(url, basePath) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname; // e.g. /wp-content/uploads/2024/05/CEO-110-84-scaled.jpg
  
  // Create relative path like 2024/05/CEO-110-84-scaled.jpg
  const relativePath = pathname.replace('/wp-content/uploads/', '');
  const fullPath = path.join(basePath, relativePath);
  
  // ensure dir exists
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // if file already exists, we skip it to save time, unless we want to overwrite
  // Let's overwrite just in case they are corrupted.
  
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(fullPath);
      response.data.pipe(writer);
      writer.on('finish', () => resolve(true));
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`Failed to download ${url}: ${err.message}`);
    return false;
  }
}

async function run() {
  const basePath = path.join(__dirname, 'public/images/motorcycles');
  console.log(`Starting download of ${images.length} images...`);
  
  let successCount = 0;
  for (let i = 0; i < images.length; i++) {
    const success = await downloadImage(images[i], basePath);
    if (success) successCount++;
    if (i % 20 === 0) console.log(`Downloaded ${i} / ${images.length}`);
  }
  
  console.log(`Finished downloading. Success: ${successCount}`);
}

run();
