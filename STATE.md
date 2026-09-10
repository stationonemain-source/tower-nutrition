# The Tower Energy & Nutrition — scroll-film site — STATE (HEAD file; read this first)

Built 2026-09-07 by Claude on the PC (scroll-film-studio, Lane B). **v2 "floating" shipped the same night** after
Circle's second brief: "floating, not on a pedestal — more pop, college kids, scroll animation everywhere,
everything crazy." This is OUR spec/demo build for the business, not the owner's site. They have NO website.

**LIVE: https://stationonemain-source.github.io/tower-nutrition/** — repo `stationonemain-source/tower-nutrition`,
GitHub Pages serves the `pages` branch (root) = `site/` split out of `main`. Redeploy after any change to `site/`:

    cd ~/tower-nutrition && git subtree split --prefix site -b pages && git push -f origin pages

Pages rebuilds in ~40 s. No `gh` CLI on the PC: the repo was created over the REST API with
`~/.station/secrets/github_token.txt`.

## What exists
- `site/` — the deliverable. `index.html`, `css/site.css`, `js/loadout.js`, `js/manifest.js`, `js/vendor/`
  (GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.18), `frames/01..05/f_001..061.webp` (alpha, 1084×1080 centre crops from the 2K upscales, ~6 MB a
  drink, 30 MB total), `img/` (alpha posters: 01 at 3200 wide from the 4k still, others 2560; 1000-wide cards).
- `keyframes/float/` — five Nano Banana Pro "levitating" stills (01 at 4k) + `*-cut.png` (Image Background
  Remover silhouettes). `keyframes/*.png` — the v1 pedestal stills (kept, unused). NOT in git.
- `clips/float/` — five Kling 3.0 Turbo 1080p rotations + `*-alpha.mp4` (Video Background Remover output).
  `clips/*.mp4` — the v1 Seedance pedestal turntables (kept, unused). NOT in git.
- Scripts: `gen-kling.sh` (Kling + remover), `assemble-float.sh` (union matte → alpha frames), `posters.sh`
  (union matte → alpha posters), v1's `gen-clip.sh`/`assemble-frames.sh`. `BRIEF.md` = research with sources.
- `verify/` — `jank2.js` (located jank test), `probe.js` (offsets/errors/ready time), captures. NOT in git.
- Preview: `.claude/launch.json` entry `tower-nutrition` → `python -m http.server 8766` on `site/`.

## v3 (2026-09-07, later the same day) — "smoother, real flavors, real photos, real branding"
Circle: "flow more, less laggy; real Tower flavors, fact-checked; my real Tower photos; official branding."
- **Perf/feel**: HUD `backdrop-filter` removed (re-blurred every frame over a live canvas), glow `filter:saturate`
  removed, shadow `filter:blur` replaced by a plain gradient, swipe blur 6→4 px, canvas DPR cap 1.5→1.25, swipe
  unit 0.45→0.62 (longer whip), playhead lerp .12→.16, Lenis lerp .085→.11, particles 110/11→70/8.
  Headless jank after: 1584 frames, p95 35 ms, max 63 ms, 6 frames >50 (all on the first whip and the lineup
  pin — software raster). Real-GPU feel is what Circle judges; nothing here is measured on a GPU.
- **Flavors, fact-checked** (first-party = their own Google Business photos / IG posts; second = customer reviews):
  Skittles, Tropical Splash, Caribbean Paradise (owner flavor cards, photos g21/g22/g61) · Açaí Berry, Orange,
  Memorial Day Tea (owner posts g02/g03) · Bubbles (g42) · Lucky Me Gotta Tea (sticker, g01) · Viva Las Vegas
  (IG post 08-31) · Wondermelon, Hurricane Huda, Sour Gummy Worm, Chocolate Brownie shake (reviews only).
  Cup 03 renamed **Sour Gummy Worm → Tropical Splash** because the owner card is yellow-on-green exactly like the
  footage. The flavor wall in the board section lists all of the above; nothing else is named anywhere.
- **Real photos**: 61 owner photos pulled from the Google Business listing at 1800 px (`photos/raw/`, `verify/
  gphotos.js`); 17 converted to `site/img/p/` (1400 + 720 wide WebP). New "SIT DOWN. SIP UP." section (their
  wall slogan) with two scroll-scrubbed strips, a parallax polaroid in Story, a parallax storefront banner above
  Visit, and three flavor-card tiles in the wall. Instagram could not be harvested (JS blocked, story viewer
  freezes screenshots) — Google's copies of their photos are the source.
- **Hours corrected from their own door decal** (visible in photo g08): Mon–Fri 7am–7pm, Sat–Sun 9am–5pm.
  Sunday was 9–6 from a search summary; the door says 5.
- **Branding**: the sign (g08/g27) shows a straight rectangular lattice tower left of a stacked THE / TOWER in a
  condensed bold sans, "Energy & Nutrition" beneath; the wall wordmark (g04/g15) is the same in red. Lockup
  redrawn as that rectangular lattice; lockup face switched to Oswald 700 (closest Google face to the sign).
  Still not their vector file — get it from the owner before this ships as theirs.
- Facebook Graph profile-picture endpoint returns a placeholder without a token; TikTok captions parse
  failed on escapes (low value; skipped).

## v3.1 — "main drinks are still blurry" (2026-09-07)
Cause: frames were the full 16:9 Kling frame downscaled to 1280 wide, then cover-fit UP to the viewport — every
cup was upsampled ~1.3–2×. Fix: `assemble-float.sh` now keeps NATIVE resolution and crops the centre
`1080×1076` (x 424–1504 of the 1928 frame — the cup plus the whole ice orbit; the void is transparent so nothing
is lost), WebP q86. `draw()` fits by HEIGHT and centres (no cover-fit); the poster is sized the same way
(`height:100%; width:auto; translate:-50% 0`) so the first-scroll handoff does not jump. Cup canvases DPR cap
back to 1.5, particle canvases stay at 1.25. Payload 16 → 19 MB. Headless jank p95 46 ms / max 65 ms — the
software raster pays for the bigger blit; on a GPU it is a texture blit. If the box still stutters, the next
lever is the crop width (1080 → 960) and B_KEEP 18 → 12, not the resolution.

## v3.2 — the blur was the FOOTAGE, so: Bytedance 2K upscale (2026-09-07)
Native-res crops alone still looked soft next to the 4k still: Kling 1080p mid-rotation is soft. **Bytedance Video
Upscale, 2K, preset `aigc`, is 0.2 credits a clip** (1 credit for all five; balance 37.1 → 36.1) and returns
2580×1440 with real added detail (condensation, ice edges, sticker text). `assemble-float.sh` now prefers
`clips/float/NN-up.mp4` when present, scales the remover matte to the source with `scale2ref`, centre-crops 56 %
of the width, downsamples to 1080 tall (lanczos) with a light unsharp, WebP q82 → frames 1084×1080, ~6 MB a
drink, **30 MB total** (was 19). Levers if that is too heavy: q82→76, or every 3rd frame (41/drink, −33 %).
Balance now 36.1 credits.
**The decoded-image cache was the real hog.** Frames were loaded as `new Image()` objects: Chrome keeps decoded
pixels for those (4.7 MB × 305 = 1.4 GB potential) on top of the bitmap window. `pump()` now `fetch()`es each frame
as an encoded Blob and `createImageBitmap(blob)` decodes only the window. Headless jank went p95 63 → **17 ms**,
max 94 → 75, slow frames 144 → 4 (the first whip + the lineup pin). Never load frames as `<img>` again.
**The box itself is the constraint**: while testing, this PC had ~0.7–1.1 GB free of 16 GB (Circle's own Chrome
≈1.7 GB across 37 processes, the Krypt terminal ≈0.5 GB). Any heavy page stutters here regardless of code, and the
headless jank numbers swing 65 ms → 10 s with free RAM. So: frames q78 with no unsharp (~4.5 MB a drink), bitmap
window ±8 keep 10 (≈50 MB per active cup, was ≈85), and judge smoothness on a machine with headroom too.

## v3.3 — THE REAL CUP HAS A FLAT LID (2026-09-07, Circle caught it)
Every generated cup had a dome lid; The Tower's real cups (their IG/Google photos) are clear cups with a FLAT
sip lid and a straw through it. Fixed at the source: `keyframes/flat/` = the five floating stills regenerated
with Nano Banana Pro using each dome still as the reference and "change ONLY the lid" (2 credits each, 10).
Then re-filmed what the balance allowed: **01 Wondermelon Kling 1080p + matte + 2K upscale, 02 Hurricane Huda
Kling 720p + matte + 2K upscale** (`clips/flat/`). Balance 36.1 → **6.2** — cups 03/04/05 have NO flat-lid
footage yet. The engine has a still path: a drink with 0 frames in `manifest.js` keeps its flat-lid poster and
sways ±14° across its turn (`sl._sway` in `render()`), so no dome lid appears anywhere on the site.
To finish: 3 × (Kling 720p 7.5 + remover 1 + upscale 0.2) ≈ 26 Higgsfield credits, or film them on Circle's own
Kling account (`gen-kling-flat720.sh <name> keyframes/flat/<name>.png "$(cat clips/float/kling.prompt.txt)"`
is the exact recipe; drop the mp4 in `clips/flat/`, run the remover, then `./assemble-float.sh <name>`).
`assemble-float.sh` now reads `clips/flat/` + `keyframes/flat/`, and the poster silhouette is a CLOSING
(dilate×12 → erode×12) so the sticker text no longer punches see-through holes in the stills.

## v3.4 — all five cups filmed with flat lids (2026-09-07 evening)
Cups 03/04/05 were filmed on **Circle's own Kling account** (kling.ai, Video 3.0, 1080p, 5 s, Native Audio OFF,
40 Kling credits each = 120; balance there 2.8k) by driving the web app in Chrome: upload `keyframes/flat/NN.png`
as the start frame, paste `clips/float/kling.prompt.txt` (brownie variant swaps "ice cubes and water droplets" for
"brownie chunks, chocolate chips and syrup drops"), Generate, then the card's download button → `~/Downloads/kling_*.mp4`.
Identity is NOT in the filename — confirm by first frame before staging. Kling stamps a "KlingAI 3.0" watermark bottom-right;
the 56 % centre crop discards it (the "Without Watermark" option in the download panel is the cleaner path next time).
Then `finish-kling.sh <name> <mp4>` = Higgsfield Video Background Remover (1) + Bytedance 2K aigc upscale (0.2) + assemble.
Higgsfield balance now **2.6 credits**. `manifest.js` has 61 frames for all five; the still-float path is dormant (kept).
Kling result videos are served from a service-worker cache — they never appear in the network log or resource
timing, so the download button is the only retrieval path from the web app.

## v3.5 — MOBILE (2026-09-08, "it wasn't loading correctly" on Circle's phone)
Root cause most likely **stale cache**: `index.html` changed across every version while `css/site.css` and
`js/loadout.js` had no cache-buster, so a phone that had visited before ran the OLD engine against NEW markup.
Every CSS/JS URL now carries `?v=YYYYMMDDHHMM` — bump it (the deploy step does) whenever those files change.
Plus a real mobile path, `LITE` in loadout.js (min(innerWidth, innerHeight) < 820, or touch + width < 1100):
- `site/frames-m/` — the same frames at 616 tall, q74 (13 MB total; a phone draws the cup ~620 px tall, so this
  is native). Built from `frames/` with one ffmpeg line in `assemble-float.sh`'s tail (rebuild after any frame change).
- loads only cups 0 + 1 at boot (~6 MB), the rest as chapters approach; bitmap window 6/8; canvas DPR cap 1.25,
  fx canvases 1.0; particles 24/4; no swipe blur; `decodeBlob()` falls back to an `<img>` when
  `createImageBitmap(blob)` rejects (older Safari).
- cup drawn at 70 % of the stage height, pushed 3 % down (`CUP`/`CUPY`), poster sized the same in CSS, so the top
  name line clears the lid; `<picture>` serves a 1100-tall hero poster on phones.
Verified in the Browser pane at 375×812 (Pixel UA, touch): ready, no console errors, scrollWidth 375, frames-m
served (frames/ untouched on desktop), lineup pin swipes horizontally.

## v3.6 — lids that LIFT mid-turn, phone perf, Station credit (2026-09-08)
- `verify/lids_all.jpg` (7 frames per cup, built from `frames/`): 01 and 05 keep the flat lid flat; **02, 03, 04 let the
  lid bulge into a shallow dome mid-rotation** (Kling drifts toward the dome it has seen most). Re-filmed those three on
  Circle's Kling with the prompt extended: "The FLAT clear lid stays perfectly flat and pressed flush onto the rim of the
  cup for the entire clip: it never lifts, never bulges, never becomes a dome, and the straw stays fixed through it."
  Driven through script this time because Chrome was minimised (visibilityState hidden, 0×0 viewport): `file_upload`
  on the input ref still registers the start frame, the textarea takes the native-setter + `input` event, and
  `button.click()` submits; the Native Audio toggle does NOT respond while hidden, so these three ran with audio ON
  (60 Kling credits each instead of 40 — the audio track is discarded by the pipeline). Check the new clips with the
  same lid sheet before assembling; if a lid still domes, add an end frame = the start image (frame-mode supports it).
- Phone perf (LITE): no rotateY/rotateZ in the swipe, front particle canvas off, `headTheme()` every 4th tick, accent
  swapped instantly instead of tweening a :root var (that tween restyled the whole page every frame). Headless with a
  4× CPU throttle and NO GPU: p95 ≈ 46 ms — an upper bound, the alpha canvases composite in software there.
- Footer: "Designed and hosted by Station.Solutions" → https://station.solutions (`.foot-credit`), verified live.
- Every deploy re-stamps `?v=` on css/js (see the deploy command in v3.5) — do not skip it.

## v3.7 — the footer was UNCLICKABLE (2026-09-08)
The curtain footer is `position:fixed; z-index:0`, revealed as `main` (`position:relative; z-index:1`) scrolls
off it. `.foot-spacer` had `pointer-events:none`, but **`main` itself did not** — so `elementFromPoint` over the
footer returned `MAIN`, and every footer link (Station credit, the three socials, AND the phone number) was dead.
Fix: `main{pointer-events:none}` + `main>*{pointer-events:auto}`, so main is click-through only where it is
transparent. Verified with `elementFromPoint` at each link centre, desktop 1440 and mobile 390: all hit their own
`<a>`. Any future fixed element under `main` has the same hazard — test by hit-testing, never by looking.

## v3.8 — lineup section CUT, word-safe headings, mobile audit #2 (2026-09-08)
Circle: the film already walks you through all five drinks, so the "Five of the regulars" section repeated the
same information and made the page longer for no gain. **Removed `#lineup` entirely** (section, nav link, the
pinned horizontal run in `choreography()`, and its CSS block). Page height at 375 px went 19,039 → 17,424,
about 1,600 px shorter, and one ScrollTrigger pin is gone.
- **The drink names still exist for search and screen readers**: an `sr-only` list of all five names +
  descriptions sits right after the page `h1`. Do not delete it — the visual titles are `aria-hidden`, and
  flavour names ("sour gummy worm tea Norman") are exactly what people search. `img/NN-card.webp` is now unused
  by the page but kept, it is what a future gallery or social crop would use.
- **"584 Buchanan Ave." broke mid-word.** `splitChars()` made every character its own `inline-block`, so the
  browser could break a line between any two letters and orphaned the "E." of "AVE.". Now it splits into words
  first, chars inside each, and `.h-display .cw{display:inline-block;white-space:nowrap}` makes each word
  unbreakable. Verified at 320/360/375/390/414/430: breaks only at spaces, no overflow at any width.
- **Header scrim.** The fixed header is transparent and display headings passed under it illegibly (worst on the
  cream sections). `.top::before` is now a top-down scrim, black on dark sections, cream under `.on-light`.
- **Tap targets.** The footer phone number and Station credit were 17–18 px tall, under the WCAG 2.5.8 24 px
  minimum. Both are `inline-block` with padding now. Nothing under 24 px remains.
- **Contrast.** `.foot-legal` used `opacity:.5`, which a child cannot undo, so the credit link measured 2.16:1.
  It dims with `color:rgba(244,239,232,.55)` instead; the link keeps full-strength `--accent` (every drink
  accent clears 4.5:1 on black). accesslint live: **0 violations**.
- Mobile 4× CPU-throttled, no GPU: p95 **28.9 ms**, max 85.5, 5 frames over 50 (was p95 46 with the pin).

## v4.0 — REAL CUPS. Every generated cup is gone (2026-09-08)
Circle: "swap in real cup photos." The five hero cups are now The Tower's OWN photography, cut out of their
Instagram/Google posts in `photos/raw/` (64 saved). No generated cup appears anywhere on the site any more.

| Slot | Drink | Source | Sticker |
|---|---|---|---|
| 01 | Skittles | g21, their own flavour card | SIPPIN' |
| 02 | Tropical Splash | g22, their own flavour card | SIPPIN' |
| 03 | Bubbles | g42, their own flavour card | THE TOWER |
| 04 | Caribbean Paradise | g61, their own flavour card | THE TOWER |
| 05 | Açaí Berry | g02, National Hydration Day post | SIPPIN' |

Every name is theirs, every sticker is the real one, every lid is the real flat lid, and each is a real hand
holding a real cup. **`cut-cup.sh` does the cutout** and its shape is hard-won:
- Their product shots are on white, so: threshold (background→0), flood the EXTERIOR to 128, keep everything
  that is not 128. Interior whites (the sticker, the lid, ice) are enclosed and survive.
- **Chaining `lutyuv` straight into `floodfill` in one graph silently leaves the seed unfilled.** Every stage is
  written to a file and re-read. Do not "tidy" it back into one filter chain.
- **A full-height cup splits the background into disconnected pockets**, so it seeds TEN points (four corners,
  four edge midpoints, two right-edge quarters). One seed only ever clears the region it lands in.
- Threshold is a parameter because pale subjects need it raised. The **chocolate shake could not be keyed at
  any threshold** — the shake is cream-coloured and reads as background with no boundary. That is why slot 05
  is Açaí Berry, not the shake. A shake needs a photo on a non-white background, or a real matte.
- Preview any new cutout over `verify/` on colour before trusting it; `corner-alpha=00` alone is not proof.

Knock-on changes:
- **The whole frame engine is dormant.** `manifest.js` is `{}`, `site/frames*` deleted, the slots carry a
  `<picture>` instead of a `<canvas>`. The canvas lookups are null-guarded so the engine no-ops rather than
  throwing. The still path drives everything: each cup rocks ±5°, drifts 30 px and breathes 5 % across its own
  segment, plus the global idle bob, and the code swipe still moves between drinks.
- **Site went 35 MB → 5.2 MB.** All five cups together are 504 KB. Nothing to lag on.
- **The invented stat bars are gone.** Energy/Sweet/Sour encoded quantities nobody had measured. The HUD now
  lists only what the photo itself proves: the drink type, the name as they write it, and which sticker is on
  the cup.
- Accents resampled from the real cups: red / lime / amber / cyan / pink.
- Mobile: cup at 52 % height, title bottom padding 228 px so two-line names clear the info panel (tightest gap
  is Caribbean Paradise at 15 px).
- The three re-filmed Kling clips are now moot — nothing on the site uses generated footage. They remain in the
  Kling account if a rotation is ever wanted again.

## v4.1 — real drinks, NO hands (2026-09-08, Circle: "go back to the other format but use the real drinks")
v4.0 put their own photos in, but every one is a hand holding a cup, and the format Circle wanted is the clean
floating cup on black. Their library has exactly ONE hand-free single-cup photo (g03 Memorial Day Tea), so the
hands had to come out of the other shots.
- Skin tones across the five run 0x6c5548 to 0xe1c39d — too wide to colour-key, and they overlap the amber
  Bubbles cup. Keying was never going to work.
- **`kling_omni_image` (Kling O1 Image) removes them for 0.5 credits each**, the cheapest image editor on the
  account by 2x. Prompt: remove the hand/fingers/rings, rebuild the covered part of the cup, keep the drink,
  layers, ice, flat lid, sticker lettering and lighting pixel-identical, plain background. All five came back
  with the drink and the SIPPIN' / THE TOWER stickers intact. Sources in `keyframes/nohand/`.
- These are still their real drinks and their real stickers; only the hand is repaired. That is a different
  thing from the generated cups v3.x used, which invented the product itself.
- **Higgsfield balance is now 0.1 credits.** Nothing further can be generated there without a top-up. Kling has
  ~2.7k credits and is the cheaper route for images anyway.
- Cutouts rebuilt from the hand-free versions with the same `cut-cup.sh`; site images regenerated at 1200 /
  760 / 520 tall.

## v5.0 — the hero stops eating the scroll (2026-09-10, Circle's notes)
Circle: people did not want to scroll through five drinks to reach the rest of the page, and asked for menu
buttons plus arrows/swipe. The hero is now **one screen** and the drinks are browsed, not scrolled.
- `#film` no longer sets its own height (was `N*1.62*100vh` ≈ 810vh). Page height at 375 px: **17,424 → ~10,430**.
- The scroll playhead (`U`/`uT`/`progress()*N*UNIT`) is gone. In its place a transition state machine:
  `fromIdx`, `navDir`, `trT` (0→1 over `TRDUR` 620 ms). `switchTo(k, dir)` starts it; `step(±1)` wraps at both
  ends so neither arrow is ever dead. Resting cups breathe on the clock rather than on scroll position.
- Controls: named **`.dchip`** buttons (NOT `.chip` — that class already belongs to the flavour wall, and its
  scroll-triggered fade would have hidden the hero's buttons), arrows, keyboard left/right, touch swipe with
  axis detection so vertical scrolling still works, and shift-wheel / trackpad horizontal on desktop.
- The photo strips after the reviews are **native horizontal scrollers** now: pointer drag on desktop, native
  swipe on touch. The page-scroll pan writes `scrollLeft` and hands over permanently on first interaction.
  A drag past 6 px cancels the click so dragging never follows a link.

### Four bugs this pass, all found by measuring rather than reading the CSS
1. `.hint` ("swipe or tap to browse") sat over the next arrow and swallowed its clicks. `elementFromPoint`
   named it. It is decoration → `pointer-events:none`.
2. The chip's active state still targeted `$$('.dot')`, which no longer exists, so highlighting never moved.
3. Mobile chip rules were inserted into the FIRST `@media (max-width:820px)` block, which sits ABOVE the base
   `.dchips` rule — equal specificity, so source order won and they silently did nothing. There are two such
   blocks in this file; overrides belong in the LAST one.
4. Chip auto-centring used `offsetLeft`, but `.dchips` is not positioned, so the offset parent is `.selector`
   and the value included the prev arrow — long names overshot back out of view. Now measured from
   `getBoundingClientRect()`, which does not care about the offset parent. Verified at 320/360/390/430.
- accesslint live: 0 violations (both photo rows needed unique labels — `region` landmarks must differ).

## Concept — "LOADOUT" v2
Loaded teas → a loadout screen. Five cups LEVITATE in a black void with ice/droplets orbiting (brownie chunks for
the shake). Each cup is its own alpha-matted 360° turntable; the name sits BEHIND the cup in giant condensed
type; accent-tinted particles behind and in front; the rig tilts toward the cursor; the cup bobs; the name skews
with scroll velocity; swipes are code-driven 3D whips (translate/rotateY/rotateZ/scale/blur). Below the film:
velocity-skewed tickers, a PINNED horizontal lineup run with parallax outlined numbers, word/char reveals,
count-up numbers, a parallax sticker bomb, alternating quote cards, sticky STACKING board cards with 500px
outlined numerals, hours lines that draw in, a badge ring that rotates with scroll, and a curtain footer.

## Footage pipeline (the part that took the most credits to learn)
- Keyframes: Nano Banana Pro, reference = the v1 still of the same drink, prompt "LEVITATING in a pure black
  void, no surface, no reflection, ice cubes and droplets suspended". 01 at 4k (4 cr), others 2k (2 cr).
- Rotation: **Kling 3.0 Turbo 1080p = 10 credits/5 s** (Seedance 2.0 720p std was 22.5). Locked camera, one
  360, void stays black. All five came back usable first try.
- Matte: the **Video Background Remover (1 cr) alone is unusable** — it drops the floating ice/droplets and
  punches holes in the cup where cubes cross it. A plain black colorkey alone keeps a dark glow halo that smears
  over the name behind the cup. The working recipe is the **UNION**: remover silhouette (gt 10 → 255, blurred)
  ∪ loose colorkey of the original (0.34/0.14, keeps anything bright: ice, droplets). Same for stills with the
  Image Background Remover (1 cr) — a plain key there also ate the black sticker text.
- ffmpeg on this box hits "Cannot allocate memory" when RAM is low (1.1 GB free at the time): run the
  assembly one clip at a time, and pre-scale the 4k still to 3200 before keying.

## Engine facts you must not break
- Driver `#film` = N×1.45×100vh + 100vh; sticky stage 100svh; unit = 1.0 turn + 0.45 swipe; one lerped playhead.
- Canvases are ALPHA (clearRect + drawImage); draw only decoded bitmaps; `nearest()` never sync-decodes.
- `ensureBitmaps` is BUDGETED (2/call) **and `release(k)` closes every bitmap of a drink that is neither active
  nor incoming** — without that, five windows of 1280×720 RGBA leaked to ~800 MB and the page stalled for a
  second at a time (max 2663 ms → 50 ms after the fix).
- **Never put a `transform` in the stylesheet on an element GSAP animates.** GSAP folds it into px at init; on a
  lazy image that is 0×0 at init, the fold is 0 and the image lands uncentered (the lineup cups vanished). Use
  the individual `translate:` property for CSS centering, or layout (the cards use grid `place-items:center`).
- The card dim in the stack is an overlay opacity via `--dim`, not `filter:brightness` (filter re-rasterises the
  500 px stroked numeral every frame).
- SVG ring text uses `textLength` + `lengthAdjust="spacing"` with ONE repeat, or it overlaps its own start.
- Header theme per section (`data-theme`), `headTheme()` reads whichever section is under y=40.
- Dev contract: `?jump` `?flat` `?jank` `?nolenis` `?noblur` `?nofx`; `window.__ready` after the jumped-to chapter
  is ≥90 % loaded. Pane screenshots of the pinned/sticky sections at a scroll offset come out BLACK on this box —
  capture artifact; use `verify.js shot` (puppeteer) for those.

## Gates passed 2026-09-07 (v2)
- accesslint: 1 finding (eyebrow contrast 3.9:1) → opacity raised to .95; re-audit after deploy.
- Mobile 375: scrollWidth 375, hero name split above/below the cup, HUD collapsed to a chip. Pinned run and
  stack verified on desktop captures (mobile pane capture of those is the black artifact above).
- Jank (headless, software raster): 1340 frames, p95 37 ms, max 50.2 ms, 1 frame at 50 ms. Ready in ~5 s local.
- Console clean. No page errors (probe.js).

## Cost receipt (Higgsfield, main@station.solutions, plus plan)
| Item | Credits |
|---|---|
| v1: 6 stills (12) + Seedance draft (7.5) + 5 Seedance 720p masters (112.5) | 132 |
| v2: 5 floating stills (4 + 4×2 = 12) + 5 Kling 1080p (50) + 5 video mattes (5) + 5 image mattes (5) | 72 |
| **Total across both versions** | **204** |
Balance 241.1 at the start → **37.1 credits** now.

## Claims on the page and where each comes from (owner should still okay before it ships)
- "Five years on the corner" ← "Tower Turns Five" birthday post. 5.0 / 257 ← Google Maps 2026-09-07. 13.3K ← IG.
- Hours Mon–Fri 7–7, Sat–Sun 9–5 ← their own door decal (photo g08). Holiday hours vary (their posts).
- Three review quotes verbatim from Google (Jennie E., Ashlee N., Mike G.).
- Drink names all appear on their channels/reviews; Hurricane Huda's flavor unknown (page describes colour only).
- Ambassador program ← their IG/TikTok "Apply to be a Tower Campus Ambassador".
- The tower mark is my own derrick line-art, NOT their logo file. Get the real vector before this ships as theirs.

## Not done / ideas if Circle wants a v3
- No ordering integration (CTA is tel: + directions). Toast/Square link would slot into `.order` and `.btn-red`.
- Sound design (a soft whoosh on swipe) is easy with WebAudio but needs a user gesture; left out on purpose.
- A 6th "seasonal drop" cup could be generated in ~14 credits (still + Kling + mattes).
