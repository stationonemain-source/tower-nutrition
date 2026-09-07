# patch_v3.py — v3 content: Tropical Splash (owner flavor card), real-photo strips, flavor wall, storefront banner, polaroid.
import io, os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'site'))

def patch(path, pairs):
    s = io.open(path, encoding='utf-8').read()
    for a, b in pairs:
        assert a in s, 'MISSING in %s: %s' % (path, a[:80])
        s = s.replace(a, b, 1)
    io.open(path, 'w', encoding='utf-8').write(s)
    print(path, 'ok', len(pairs), 'edits')

sipup = '''
<!-- ============ SIT DOWN. SIP UP. — real photos, parallax strips ============ -->
<section id="photos" class="sipup" data-theme="dark" aria-label="Photos from The Tower">
  <div class="wrap sipup-head">
    <span class="kicker mono reveal">Their wall says it</span>
    <h2 class="h-display" data-words>Sit down. Sip up.</h2>
  </div>
  <div class="strip" data-dir="-1">
    <div class="strip-row">
      <img src="img/p/g08-s.webp" alt="The Tower storefront on Campus Corner" loading="lazy" decoding="async">
      <img src="img/p/g04-s.webp" alt="On the red couch under the red THE TOWER wordmark" loading="lazy" decoding="async">
      <img src="img/p/g06-s.webp" alt="Two friends on the black staircase under the lattice tower mural" loading="lazy" decoding="async">
      <img src="img/p/g38-s.webp" alt="A whole table of cups for a group order" loading="lazy" decoding="async">
      <img src="img/p/g52-s.webp" alt="A tea in front of the Historic Campus Corner sign" loading="lazy" decoding="async">
      <img src="img/p/g05-s.webp" alt="A husky with a blue tea" loading="lazy" decoding="async">
      <img src="img/p/g21-s.webp" alt="Skittles tea flavor card" loading="lazy" decoding="async">
    </div>
  </div>
  <div class="strip" data-dir="1">
    <div class="strip-row">
      <img src="img/p/g14-s.webp" alt="The Sit Down Sip Up wall with a row of cups" loading="lazy" decoding="async">
      <img src="img/p/g33-s.webp" alt="Three teas in an Energy cup carrier" loading="lazy" decoding="async">
      <img src="img/p/g02-s.webp" alt="A rainbow row of Tower cups" loading="lazy" decoding="async">
      <img src="img/p/g25-s.webp" alt="On the stairs under the tower mural" loading="lazy" decoding="async">
      <img src="img/p/g36-s.webp" alt="A chocolate protein shake with sprinkles" loading="lazy" decoding="async">
      <img src="img/p/g39-s.webp" alt="Milk pouring into an iced coffee" loading="lazy" decoding="async">
      <img src="img/p/g44-s.webp" alt="A husky at the counter" loading="lazy" decoding="async">
    </div>
  </div>
  <p class="sipup-note mono">Photos: The Tower's own Google Business listing</p>
</section>
'''

wall = '''  <div class="wrap flavors">
    <div class="sec-head"><span class="kicker mono reveal">On the board</span><h3 class="h-display h-sm" data-words>Names off their own cups.</h3></div>
    <ul class="flavor-wall" aria-label="Flavors seen on The Tower's own posts and reviews">
      <li class="chip" style="--c:#FF2D55">Skittles</li>
      <li class="chip" style="--c:#B5F02A">Tropical Splash</li>
      <li class="chip" style="--c:#3D9BFF">Caribbean Paradise</li>
      <li class="chip" style="--c:#7A3FBF">Açaí Berry</li>
      <li class="chip" style="--c:#FF9A2E">Orange</li>
      <li class="chip" style="--c:#E63946">Memorial Day Tea</li>
      <li class="chip" style="--c:#FF3B6B">Viva Las Vegas</li>
      <li class="chip" style="--c:#FF5C8A">Wondermelon</li>
      <li class="chip" style="--c:#6B7BFF">Hurricane Huda</li>
      <li class="chip" style="--c:#9BE22C">Sour Gummy Worm</li>
      <li class="chip" style="--c:#F2C14E">Bubbles</li>
      <li class="chip" style="--c:#D9B48F">Chocolate Brownie</li>
      <li class="chip" style="--c:#C8102E">Lucky Me Gotta Tea</li>
      <li class="chip chip-photo"><img src="img/p/g22-s.webp" alt="Tropical Splash flavor card" loading="lazy" decoding="async"></li>
      <li class="chip chip-photo"><img src="img/p/g61-s.webp" alt="Caribbean Paradise flavor card" loading="lazy" decoding="async"></li>
      <li class="chip chip-photo"><img src="img/p/g21-s.webp" alt="Skittles flavor card" loading="lazy" decoding="async"></li>
    </ul>
    <p class="board-note">Seasonal drops rotate. Menu and pricing at the counter or by phone. Say what you're in the mood for and they'll build it.</p>
  </div>'''

patch('index.html', [
    ('<div class="title" data-i="2" style="--fs:10.5vw;--fs-m:18vw"><span class="ln"><span>Sour Gummy</span></span><span class="ln"><span>Worm</span></span></div>',
     '<div class="title" data-i="2" style="--fs:13vw;--fs-m:22vw"><span class="ln"><span>Tropical</span></span><span class="ln"><span>Splash</span></span></div>'),
    ('<p class="hud-note">Lime into lemon. It puckers first, then it hits.</p>',
     '<p class="hud-note">Lime into lemon. Straight off their own flavor card, yellow on green.</p>'),
    ('<button class="dot" type="button" role="tab" aria-selected="false" data-go="2"><span>Sour Gummy Worm</span></button>',
     '<button class="dot" type="button" role="tab" aria-selected="false" data-go="2"><span>Tropical Splash</span></button>'),
    ('alt="Sour Gummy Worm energy tea, lime and lemon"', 'alt="Tropical Splash energy tea, lime and lemon"'),
    ('<span class="hcard-name">Sour Gummy Worm</span><span class="hcard-sub mono">Energy tea · lime, lemon</span>',
     '<span class="hcard-name">Tropical Splash</span><span class="hcard-sub mono">Energy tea · lime, lemon</span>'),
    ('''      <div class="story-copy reveal">
        <p>Energy teas, protein shakes, a green wall, a red couch everybody ends up on.''',
     '''      <div class="story-copy reveal">
        <figure class="polaroid"><img src="img/p/g15-s.webp" alt="Four friends on the red couch under the red THE TOWER wordmark" loading="lazy" decoding="async"><figcaption class="mono">The red couch · 584 Buchanan</figcaption></figure>
        <p>Energy teas, protein shakes, a green wall, a red couch everybody ends up on.'''),
    ('<!-- ============ THE BOARD — stacking cards ============ -->', sipup + '\n<!-- ============ THE BOARD — stacking cards ============ -->'),
    ('''  <div class="wrap"><p class="board-note">Menu and pricing at the counter or by phone. Say what you're in the mood for and they'll build it.</p></div>''', wall),
    ('''<section id="visit" class="visit" data-theme="light">
  <div class="wrap">''',
     '''<section id="visit" class="visit" data-theme="light">
  <div class="visit-photo" aria-hidden="true"><img src="img/p/g08.webp" alt="" decoding="async" loading="lazy"><span class="visit-photo-tag mono">584 Buchanan Ave · Campus Corner</span></div>
  <div class="wrap">'''),
    ('    <a href="#lineup">Lineup</a>\n    <a href="#menu">Board</a>', '    <a href="#lineup">Lineup</a>\n    <a href="#photos">Photos</a>\n    <a href="#menu">Board</a>'),
])

css_add = '''/* ---------- sit down sip up: parallax photo strips ---------- */
.sipup{background:var(--black);color:var(--bone);padding:clamp(80px,10vw,150px) 0 clamp(40px,5vw,72px);overflow:hidden}
.sipup-head{margin-bottom:clamp(28px,4vw,56px)}
.strip{overflow:hidden;padding:10px 0}
.strip-row{display:flex;gap:14px;width:max-content;will-change:transform}
.strip img{height:clamp(200px,30vh,360px);width:auto;border-radius:12px;flex:none}
.strip[data-dir="1"] .strip-row{margin-left:-18vw}
.sipup-note{margin:26px auto 0;width:min(1360px,100% - 2*var(--gutter));opacity:.45}
.polaroid{margin:0 0 26px;padding:12px 12px 14px;background:#fff;border-radius:6px;box-shadow:0 24px 60px rgba(15,15,17,.18);width:min(320px,80%);will-change:transform}
.polaroid img{border-radius:2px;aspect-ratio:3/4;object-fit:cover}
.polaroid figcaption{margin-top:10px;opacity:.6}
.flavors{padding:clamp(56px,7vw,110px) 0 0;position:relative;background:var(--black)}
.h-sm{font-size:clamp(40px,6vw,96px)}
.flavor-wall{list-style:none;margin:clamp(24px,3vw,40px) 0 0;padding:0;display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.chip{font-family:var(--disp);font-weight:900;text-transform:uppercase;font-size:clamp(26px,3.2vw,52px);line-height:1;padding:14px 20px 12px;border:1px solid var(--line);border-radius:999px;color:var(--bone);transition:background .3s,color .3s;will-change:transform,opacity}
.chip:hover{background:var(--c);color:#000}
.chip-photo{padding:0;border:0;width:clamp(84px,9vw,140px);height:clamp(84px,9vw,140px);border-radius:16px;overflow:hidden;background:#fff}
.chip-photo img{width:100%;height:100%;object-fit:cover}
.visit-photo{position:relative;height:clamp(320px,62vh,640px);overflow:hidden;margin-bottom:clamp(48px,6vw,96px)}
.visit-photo img{position:absolute;left:0;top:-12%;width:100%;height:124%;object-fit:cover;will-change:transform}
.visit-photo-tag{position:absolute;left:var(--gutter);bottom:22px;padding:10px 14px;background:rgba(0,0,0,.55);color:var(--bone);border-radius:999px}
.visit{padding-top:0}

/* ---------- board: stacking cards ---------- */'''

patch('css/site.css', [
    ('/* ---------- board: stacking cards ---------- */', css_add),
    ('.flat .foot{position:relative}', '.flat .strip-row{flex-wrap:wrap;width:auto}\n.flat .foot{position:relative}'),
    ('  .foot-word{font-size:22vw}\n}', '  .foot-word{font-size:22vw}\n  .strip img{height:180px}\n  .polaroid{width:min(260px,70%)}\n  .visit-photo{height:46vh}\n}'),
])

js_add = '''    /* 2b. SIT DOWN SIP UP — photo strips slide opposite ways with scroll; polaroid + storefront parallax; chips pop in */
    $$('.strip').forEach(function (st) {
      var dir = +st.getAttribute('data-dir') || -1, row = $('.strip-row', st);
      gsap.fromTo(row, { x: dir < 0 ? 0 : -260 }, { x: dir < 0 ? -420 : 160, ease: 'none', scrollTrigger: { trigger: st, start: 'top bottom', end: 'bottom top', scrub: 0.4 } });
      gsap.from($$('img', row), { y: 40, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: st, start: 'top 90%', once: true } });
    });
    var pol = $('.polaroid');
    if (pol) gsap.fromTo(pol, { y: 60, rotation: 6 }, { y: -60, rotation: 1, ease: 'none', scrollTrigger: { trigger: $('#story'), start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
    var vp = $('.visit-photo img');
    if (vp) gsap.fromTo(vp, { yPercent: -9, scale: 1.08 }, { yPercent: 9, scale: 1, ease: 'none', scrollTrigger: { trigger: $('.visit-photo'), start: 'top bottom', end: 'bottom top', scrub: 0.4 } });
    var chips = $$('.chip');
    if (chips.length) gsap.from(chips, { y: 30, opacity: 0, rotation: function (i) { return i % 2 ? 4 : -4; }, stagger: 0.04, duration: 0.7, ease: 'back.out(1.6)', scrollTrigger: { trigger: $('.flavor-wall'), start: 'top 88%', once: true } });

    /* 3. word + char reveals */'''

patch('js/loadout.js', [('    /* 3. word + char reveals */', js_add)])
print('v3 patch complete')
