const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[${msg.type()}] ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    console.log(`[pageerror] ${error.message}`);
  });

  console.log("Navigating to http://localhost:3000...");
  await page.goto('http://localhost:3000');
  
  // Wait for 3 seconds to let WebGL initialize
  await page.waitForTimeout(3000);
  
  await browser.close();
  console.log("Done.");
})();
