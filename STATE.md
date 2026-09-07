# The Tower Energy & Nutrition — scroll-film site — STATE (HEAD file; read this first)

Built 2026-09-07 by Claude on the PC (scroll-film-studio, Lane B / Higgsfield). Circle's brief: the whole site
is a character-select screen for their drinks — 4K hero, scroll turns the cup, keep scrolling and it swipes to
the next one in 3D. This is OUR spec/demo build for the business, not the owner's site. **They have no website**
(Google Business Profile: "Add website"), 13.3K Instagram followers, 5.0★ on 257 Google reviews.

## What exists
- `site/` — the whole deliverable, static. `index.html`, `css/site.css`, `js/loadout.js`, `js/manifest.js`
  (frame counts), `js/vendor/` (GSAP 3.12.5, ScrollTrigger, Lenis 1.1.18), `frames/01..05/f_001..061.webp`
  (5 × 61 frames, 1280 wide, 6.8 MB total), `img/` (2560-wide hero poster + 900-wide cards).
- `keyframes/` — the five Nano Banana Pro 2k stills (the "4K hero" is 01 at 2752×1536). NOT in git (27 MB).
- `clips/` — the five Seedance 2.0 masters (720p std, 5 s, 121 frames, audio off) + contact sheets. NOT in git.
- `BRIEF.md` — research (every verified fact with its source), concept, art direction, cost plan.
- `gen-clip.sh` — Seedance clip helper (bash, Windows Git Bash). `assemble-frames.sh` — frames/posters/manifest.
- `verify/` — puppeteer captures + `jank2.js` (located jank test). Captures NOT in git.
- Preview: `.claude/launch.json` entry `tower-nutrition` → `python -m http.server 8766` on `site/`.

## Concept — "LOADOUT"
Loaded teas → loadout screen. Five cups on a black turntable: Wondermelon, Hurricane Huda, Sour Gummy Worm,
Viva Las Vegas (all energy teas), Chocolate Brownie (protein shake). Each is its OWN 360° turntable clip; the
swipes between cups are code (GSAP-free direct transforms in the tick: translate/rotateY/scale/blur in a
1400px perspective), so there are no chain seams to gate. Names swap in two non-overlapping halves. HUD =
qualitative taste bars (Energy/Sweet/Sour, or Protein/Sweet/Energy for the shake), never nutrition numbers.
Sticker per cup uses slogans off their real cups (Sippin', Lucky Me Gotta Tea, Tower Says Boomer!, XOXO, Good Vibes).

Engine facts you must not break:
- Driver `#film` height = N×1.45×100vh + 100vh; sticky `#stage` 100svh. Unit = 1.0 turn + 0.45 swipe.
  One lerped playhead `U` (0.12) drives everything; `?jump` settles it instantly.
- Canvas draws ONLY decoded ImageBitmaps (nearest decoded fallback). `nearest()` never returns an
  HTMLImageElement — a sync WebP decode on the main thread was the frame-by-frame jank.
- `ensureBitmaps` is BUDGETED (3 decodes per call, nearest-first). Issuing the whole ±14 window at once
  landed as one allocation burst = a 150 ms frame at the same point in every chapter. Keep the budget.
- The spotlight is `.slot::after` (a radial black vignette INSIDE the slot, so it travels with the 3D swipe).
  It replaced `mask-image`, which was both slower and showed the rotating rectangle's edges.
- Header theme is per-section: every section carries `data-theme="dark|light"`; `headTheme()` picks whichever
  is under y=40. Story + Visit are light; film, lineup, board, footer are dark.
- Dev contract: `?jump=N` (Lenis off, force-settled), `?flat` (film pinned to 900px for one tall capture),
  `?jank` (console meter), `?nolenis`, `?noblur`, `?nodraw`, `?keepall` (isolation flags). `window.__ready`
  fires when the jumped-to chapter is ≥90 % loaded.
- Reduced motion: posters + crossfades, no canvas, no Lenis, no reveals.

## Gates passed 2026-09-07
- accesslint live: **0 violations** (after moving the visual titles/HUDs to `aria-hidden` + a sr-only h1;
  the accessible drink list is the `#lineup` cards).
- Mobile 375 px: `scrollWidth` 375 = no horizontal overflow (measured in the Browser pane; headless Chrome on
  Windows crops below ~500 px — measure in the pane, not puppeteer).
- Console: clean. Fonts (Big Shoulders Display / Space Mono / Manrope) load from Google Fonts.
- Jank (headless, software raster, 13 px/frame scroll-through): see the line below. Headless has no GPU, so the
  3D + blur swipe rasterises in software there; the remaining spikes sit on the swipes.
  Result: 835 frames, p95 18.1 ms, max 57.6 ms, 1 frame >50 ms (first swipe, blur); with `?noblur` max 43.3 ms, 0 >50.
  Before the decode budget: max 153 ms, 7 frames >50 — all at local 0.66 of each chapter (the burst).

## Cost receipt (Higgsfield, main@station.solutions, plus plan)
| Item | Credits |
|---|---|
| Nano Banana Pro keyframes 2k 16:9 (1 hero + 1 hero retake for a visible softbox + 4 drinks) | 6 × 2 = 12 |
| Seedance 2.0 draft, 480p fast, audio off (prompt validation) | 7.5 |
| Seedance 2.0 masters, 720p std, audio off × 5 | 112.5 |
| **Total** | **132** |
Balance 241.1 → **109.1**. Zero server-side failures; every job billed once. 1080p (45/clip) was not
affordable with any buffer; 720p is native to the 1280-wide frame payload anyway.

## Claims on the page and where each comes from (owner should still okay before it ships)
- "Five years on the corner" ← their "Tower Turns Five" birthday post (2026). Not a founding date claim.
- 5.0 / 257 ← Google Maps panel 2026-09-07. 13.3K ← Instagram profile. "7 days a week" ← hours.
- Hours Mon–Fri 7–7, Sat 9–5, Sun 9–6 ← Yelp/Google via search summary. **Verify with the owner.**
- Three review quotes are verbatim excerpts from Google (Jennie E., Ashlee N., Mike G.).
- Drink names all appear on their channels/reviews. Hurricane Huda's real flavor is unknown — the page
  describes only its colour. Viva Las Vegas ingredients are their own post's words.
- Campus Ambassador program ← their IG/TikTok "Apply to be a Tower Campus Ambassador".
- Removed as unsupported: "made in-house", "free teas", "the one people drive back for".
- The tower mark on the site header is my own line-art derrick, inspired by their logo, NOT their logo file.
  Get the real vector from the owner before this ships.

## Not done / next
- Not deployed anywhere. Local only (port 8766). Deploy path when Circle says go: new repo
  `stationonemain-source/tower-nutrition`, GitHub Pages from `site/` (same shape as downtown-fitness).
- No lead form / booking; the CTA is `tel:` + directions. If they want ordering, that's a Toast/Square link.
- The sticker rim text spins (CSS); slogans are static. Reduced motion stops it.
