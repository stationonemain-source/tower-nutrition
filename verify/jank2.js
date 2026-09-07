// jank2.js <url> — like verify.js jank, but reports WHERE the slow frames happen (scrollY + film unit).
const puppeteer = require('C:/Users/Circl/.claude/skills/scroll-film-studio/node_modules/puppeteer-core');
(async () => {
  const url = process.argv[2];
  const b = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: 'new', args: ['--hide-scrollbars', '--no-sandbox'] });
  const page = await b.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForFunction('window.__ready === true', { timeout: 45000 });
  await new Promise(r => setTimeout(r, 2500)); // let all drinks finish loading
  const res = await page.evaluate(() => new Promise(res => {
    const end = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const film = document.getElementById('film'); const H = innerHeight;
    const slow = [], deltas = []; let last = performance.now(), y = 0;
    const tick = () => {
      const now = performance.now(); const d = now - last; last = now; deltas.push(d);
      if (d > 50) { const r = film.getBoundingClientRect(); const p = Math.max(0, Math.min(1, -r.top / (r.height - H))); slow.push({ y, ms: +d.toFixed(1), unit: +(p * 7.25).toFixed(2) }); }
      y += 13; scrollTo(0, Math.min(y, end));
      if (y < end) requestAnimationFrame(tick);
      else { deltas.sort((a, b) => a - b); res({ frames: deltas.length, p95: +deltas[Math.floor(deltas.length * .95)].toFixed(1), max: +deltas[deltas.length - 1].toFixed(1), over50: slow.length, slow }); }
    };
    requestAnimationFrame(tick);
  }));
  console.log(JSON.stringify(res));
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
