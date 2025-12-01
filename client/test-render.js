const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('BROWSER:', msg.type(), msg.text());
  });
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
    const content = await page.content();
    console.log('Page loaded, body length:', content.length);
  } catch (e) {
    console.log('ERROR:', e.message);
  }
  
  await browser.close();
})();
