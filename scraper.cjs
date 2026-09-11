const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrape() {
  const { data } = await axios.get('https://motolux.com.tr/modeller/');
  const $ = cheerio.load(data);
  const images = [];
  $('img.kw-prodimage-img').each((i, el) => {
    let src = $(el).attr('src');
    if (src && src.includes('wp-content/uploads')) {
      images.push(src);
    }
  });
  console.log("Found images:", images.length);
  fs.writeFileSync('motolux_images.json', JSON.stringify(images, null, 2));
}
scrape();
