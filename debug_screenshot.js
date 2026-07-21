const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1536, height: 776 });
  
  console.log("Navigating to http://localhost:3000...");
  await page.goto('http://localhost:3000');
  
  // Wait for 3 seconds to let WebGL initialize
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'final_screenshot_after_font_fix.png' });
  console.log("Screenshot saved to final_screenshot_after_font_fix.png");
  
  await browser.close();
  console.log("Done.");
})();
