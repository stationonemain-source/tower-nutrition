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
