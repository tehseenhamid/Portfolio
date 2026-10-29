// Captures REAL screenshots of your live sites into assets/shots/.
// Run once on your own computer:
//   npm i playwright && npx playwright install chromium
//   node scripts/capture-screenshots.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const sites = {
  ecomate:  'https://ecomatecleaning.com.au/',
  jsonpest: 'https://jsonpestcontrolmelbourne.com.au/',
  beewasp:  'https://beewaspsolutions.com.au/',
  jet:      'https://tehseenhamid.github.io/jet-charter/',
  elite:    'https://tehseenhamid.github.io/elite_wheels-car-rental/',
  xaviers:  'https://tehseenhamid.github.io/XaviersCarRentalWebsite/',
  nova:     'https://tehseenhamid.github.io/Ai_Chatbot/',
  lms:      'https://tehseenhamid.github.io/SchoolLMS/',
  abasyn:   'https://tehseenhamid.github.io/abasyn_school/',
  school:   'https://tehseenhamid.github.io/School_Website/',
};

(async () => {
  const out = path.join(__dirname, '..', 'assets', 'shots');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  for (const [name, url] of Object.entries(sites)) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(4000); // let intros / loaders / animations finish
      await page.screenshot({ path: path.join(out, name + '.jpg'), type: 'jpeg', quality: 84 });
      console.log('saved', name);
    } catch (e) {
      console.log('FAILED', name, e.message.split('\n')[0]);
    }
    await page.close();
  }
  await browser.close();
})();
