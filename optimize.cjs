const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function getAllFiles(dir, all = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) getAllFiles(full, all);
    else if (entry.isFile()) all.push(full);
  }
  return all;
}

async function run() {
  const files = getAllFiles('public/images/motorcycles').filter(f => {
    const size = fs.statSync(f).size;
    const ext = path.extname(f).toLowerCase();
    return size > 250 * 1024 && (ext === '.png' || ext === '.jpg' || ext === '.jpeg');
  });

  console.log('Files to optimize:', files.length);

  const concurrency = 8;
  const queue = [...files];

  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const file = queue.shift();
      if (!file) break;
      const ext = path.extname(file).toLowerCase();
      try {
        const stat = fs.statSync(file);
        if (ext === '.png') {
          const buf = await sharp(file)
            .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
            .png({ quality: 80, compressionLevel: 8 })
            .toBuffer();
          if (buf.length < stat.size) fs.writeFileSync(file, buf);
        } else {
          const buf = await sharp(file)
            .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80, mozjpeg: true })
            .toBuffer();
          if (buf.length < stat.size) fs.writeFileSync(file, buf);
        }
      } catch (err) {
        console.error('Err:', file, err.message);
      }
    }
  });

  await Promise.all(workers);
  console.log('Optimization complete!');
}

run();
