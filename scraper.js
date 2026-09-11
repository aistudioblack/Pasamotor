const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrape() {
  const { data } = await axios.get('https://motolux.com.tr/modeller/');
  const $ = cheerio.load(data);
  const images = [];
  $('img').each((i, el) => {
    let src = $(el).attr('src');
    if (src && src.includes('wp-content/uploads')) {
      images.push(src);
    }
  });
  console.log(JSON.stringify(images, null, 2));
}
scrape();
