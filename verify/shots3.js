const p = require('C:/Users/Circl/.claude/skills/scroll-film-studio/node_modules/puppeteer-core');
(async () => {
  const b = await p.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars', '--no-sandbox'] });
  const pg = await b.newPage(); await pg.setViewport({ width: 1440, height: 900 });
  const errs = []; pg.on('pageerror', e => errs.push('PAGEERROR ' + e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await pg.goto('http://127.0.0.1:8766/?jump=0&v=9', { waitUntil: 'networkidle0', timeout: 90000 });
  await pg.waitForFunction('window.__ready===true', { timeout: 60000 });
  const off = await pg.evaluate(() => { const g = s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; }; return { h: document.documentElement.scrollHeight, story: g('#story'), photos: g('#photos'), strip2: g('.strip[data-dir="1"]'), wall: g('.flavor-wall'), visitPhoto: g('.visit-photo'), visit: g('#visit') }; });
  console.log(JSON.stringify(off)); console.log('errors:', errs.length ? errs.join('\n') : 'none');
  const shots = [['story', off.story + 120], ['photos', off.photos + 200], ['wall', off.wall - 260], ['visitphoto', off.visitPhoto - 100], ['hero', 0]];
  for (const [n, y] of shots) {
    const pg2 = await b.newPage(); await pg2.setViewport({ width: 1440, height: 900 });
    await pg2.goto('http://127.0.0.1:8766/?jump=' + y + '&v=9', { waitUntil: 'networkidle0', timeout: 90000 });
    await pg2.waitForFunction('window.__ready===true', { timeout: 60000 }); await new Promise(r => setTimeout(r, 1500));
    await pg2.screenshot({ path: 'verify/v3_' + n + '.png' }); await pg2.close(); console.log('shot', n, y);
  }
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
