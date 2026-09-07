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
  (GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.18), `frames/01..05/f_001..061.webp` (alpha, 1280 wide, ~3.2 MB a
  drink, 16 MB total), `img/` (alpha posters: 01 at 3200 wide from the 4k still, others 2560; 1000-wide cards).
- `keyframes/float/` — five Nano Banana Pro "levitating" stills (01 at 4k) + `*-cut.png` (Image Background
  Remover silhouettes). `keyframes/*.png` — the v1 pedestal stills (kept, unused). NOT in git.
- `clips/float/` — five Kling 3.0 Turbo 1080p rotations + `*-alpha.mp4` (Video Background Remover output).
  `clips/*.mp4` — the v1 Seedance pedestal turntables (kept, unused). NOT in git.
- Scripts: `gen-kling.sh` (Kling + remover), `assemble-float.sh` (union matte → alpha frames), `posters.sh`
  (union matte → alpha posters), v1's `gen-clip.sh`/`assemble-frames.sh`. `BRIEF.md` = research with sources.
- `verify/` — `jank2.js` (located jank test), `probe.js` (offsets/errors/ready time), captures. NOT in git.
- Preview: `.claude/launch.json` entry `tower-nutrition` → `python -m http.server 8766` on `site/`.

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
- Hours Mon–Fri 7–7, Sat 9–5, Sun 9–6 ← Yelp/Google via search summary. **Verify with the owner.**
- Three review quotes verbatim from Google (Jennie E., Ashlee N., Mike G.).
- Drink names all appear on their channels/reviews; Hurricane Huda's flavor unknown (page describes colour only).
- Ambassador program ← their IG/TikTok "Apply to be a Tower Campus Ambassador".
- The tower mark is my own derrick line-art, NOT their logo file. Get the real vector before this ships as theirs.

## Not done / ideas if Circle wants a v3
- No ordering integration (CTA is tel: + directions). Toast/Square link would slot into `.order` and `.btn-red`.
- Sound design (a soft whoosh on swipe) is easy with WebAudio but needs a user gesture; left out on purpose.
- A 6th "seasonal drop" cup could be generated in ~14 credits (still + Kling + mattes).
