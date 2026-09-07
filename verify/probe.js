// probe.js <url> — page errors, __ready timing, section offsets (waits for __ready, not networkidle)
const p = require('C:/Users/Circl/.claude/skills/scroll-film-studio/node_modules/puppeteer-core');
(async () => {
  const b = await p.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars', '--no-sandbox'] });
  const pg = await b.newPage(); await pg.setViewport({ width: 1440, height: 900 });
  pg.on('pageerror', e => console.log('PAGEERROR', e.message)); pg.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  const t0 = Date.now();
  await pg.goto(process.argv[2], { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pg.waitForFunction('window.__ready === true', { timeout: 60000 });
  console.log('ready in', Date.now() - t0, 'ms');
  const o = await pg.evaluate(() => { const g = s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; };
    return { h: document.documentElement.scrollHeight, ticker: g('.ticker'), lineup: g('#lineup'), run: g('.run'), story: g('#story'), menu: g('#menu'), stack: g('.stack'), visit: g('#visit'), ticker2: g('.ticker.on-bone'), spacer: g('.foot-spacer'), footH: getComputedStyle(document.documentElement).getPropertyValue('--foot-h') }; });
  console.log(JSON.stringify(o)); await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
