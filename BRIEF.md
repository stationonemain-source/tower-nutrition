# The Tower Energy & Nutrition — scroll-film site brief

Written 2026-09-07 by Claude (scroll-film-studio, Lane B / Higgsfield). This is OUR spec/demo build
for the business, not the owner's site. They have NO website (Google Business Profile says "Add website").

## The business (verified from their own channels, 2026-09-07)

| Fact | Value | Source |
|---|---|---|
| Name | The Tower Energy and Nutrition ("The Tower") | IG / FB / Google |
| Address | 584 Buchanan Ave, Norman, OK 73069 — Campus Corner, by OU | Google, IG bio |
| Phone / order ahead | (405) 300-4086 | IG bio, FB intro |
| Hours | Mon–Fri 7am–7pm · Sat–Sun 9am–5pm | Their door decal (Google photo g08); search summaries said Sun 9–6 — the door wins |
| Google | 5.0 ★, 257 reviews | Google Maps panel |
| Instagram | @thetowernutrition — 13.3K followers, 1,144 posts | IG |
| TikTok | @thetowernutrition — 1,339 followers | TikTok |
| Facebook | 676 followers | FB |
| What they sell | Energy teas (loaded teas), protein shakes, protein coffees, protein balls | IG highlights: TEAS / SHAKES / COFFEES / PROTEIN BALLS |
| Age | "Tower Turns Five" birthday post (2026) → opened ~2021 | IG grid |
| Recent | "NEW TOWER LOADING…" — remodel July 2026, reopened for fall | IG reel 2026-07-01 |
| Programs | Campus Ambassador program ("Apply to be a Tower Campus Ambassador") | IG / TikTok |
| Tagline in bio | "Healthy Shakes · Energy Teas · Good Vibes" | IG bio |

Drink names seen on their own channels / customer reviews (use these; do not invent others):
- **Wondermelon** energy tea (search summary of reviews)
- **Hurricane Huda** (specialty tea, review mention)
- **Sour Gummy Worm** tea (Google review, Ashlee N.)
- **Viva Las Vegas** — Margarita · Strawberry · Cranberry · Limeade (IG post 2026-08-31)
- **Açaí Berry / Orange** (National Hydration Day post, Google photos)
- **Memorial Day Tea** — red/white/blue layered (Google photos)
- **Chocolate Brownie** shake (Google review, Mike G.)
- Sticker slogans on cups: "Sippin'", "Lucky Me Gotta Tea", "Happy Rodeo", "Tower Says Boomer!", "XOXO The Tower", smiley "the Tower"

Nutrition numbers on the page ("24 cal · 0 sugar · 200 mg caffeine") are the standard loaded-tea
figures used across the category — NOT verified for The Tower. Owner must confirm before the site ships.

## Visual world (from ~60 photos across IG, Google, FB, TikTok)

- **Storefront**: painted red brick, black sign board "THE TOWER Energy & Nutrition", hand-lettered
  "the TOWER!" window decal, black awning frame.
- **Interior**: white walls with a huge red condensed "THE TOWER Energy & Nutrition" wordmark, exposed
  red brick, black steel staircase, red velvet couches, green turf wall behind the bar, black-line lattice
  tower mural drawn on the white wall.
- **Logo**: tall narrow black line-art lattice tower (derrick / bell-tower silhouette) to the left of
  "THE TOWER" in heavy condensed black caps, "Energy & Nutrition" small bold beneath a rule.
- **Cups**: tall clear 24 oz cups, dome or flat lids, colored straws (hot pink, teal, black, yellow), one big
  round white sticker on the front with a slogan or the logo. Drinks are neon: red, pink, blue, violet,
  yellow, orange, lime, layered two-tone.
- **People**: OU students, sorority groups, ambassadors, dogs. Bright daylight photos. Zero product-only
  hero photography exists — that is the gap this site fills.

## Concept — "LOADOUT" (chosen; Circle's own brief is this concept)

Loaded teas → a *loadout* screen. The site IS a character-select screen for drinks.

Walkthrough: you open on a 4K still — one enormous cup of Wondermelon on a black turntable, condensation,
the white Tower sticker, a hot-pink straw, the name "WONDERMELON" in giant condensed type behind it and a
HUD to the right (Energy / Calories / Sugar bars, "01 / 05"). Scroll: the cup turns on its turntable, light
raking across the condensation (scrubbed footage). Keep scrolling: it finishes its turn, then whips off to
the left in 3D perspective with motion blur as the next cup — Hurricane Huda, electric blue-violet — whips
in from the right; the name slides out and the next slides in; the bars re-tween; the counter ticks to 02.
Five drinks. The last is the Chocolate Brownie shake (the second product line). Then the film resolves: the
page melts from the black stage into the content — Campus Corner story, 5.0★/257, the menu families, order
ahead, hours, map, ambassadors, footer.

Lane B, Higgsfield: 5 independent turntable clips (Seedance 2.0), swipes done in code (GSAP 3D), so no
chain seams to gate. Hero = 2k Nano Banana Pro keyframe shown until first scroll, then canvas scrub.

## Art direction

- Palette: stage black `#0B0B0C` · charcoal `#161618` · bone `#F4EFE8` · Tower red `#C8102E`
  · per-drink accent: Wondermelon `#FF3B6B` · Hurricane Huda `#3D7BFF` · Sour Gummy Worm `#A6E22E`
  · Viva Las Vegas `#FF2D55` · Chocolate Brownie `#C9A27E`
- Type: **Big Shoulders Display** 800/900 (display, condensed, heavy — echoes their sign) ·
  **Space Mono** (HUD readouts) · **Manrope** (body)
- Motion: game-UI snap — `power4.inOut` swipes, 3D perspective 1200px, blur on the move, stat bars fill
  with stepped ease, counter ticks. No sci-fi cheese; premium beverage photography is the register.
- Sticker: inline SVG round sticker (slogan per drink) overlaid on the HUD, like the stickers on their cups.

## Cost plan (Higgsfield, balance at start 241.1 credits, plus plan, main@station.solutions)

| Item | Credits |
|---|---|
| Nano Banana Pro keyframe, 2k 16:9 | 2 each (5 + retries ≈ 20) |
| Seedance 2.0 draft, 5 s, 480p fast, audio off | 7.5 (1 clip to validate the prompt) |
| Seedance 2.0 master, 5 s, 720p std, audio off | 22.5 × 5 = 112.5 |
| 1080p std would be 45 × 5 = 225 — not affordable with any buffer | — |
| **Planned total** | **≈ 140** |

Audio OFF on every clip. Receipt goes in STATE.md when done.

## v3 addendum (2026-09-07) — flavor evidence
| Name | Evidence | Strength |
|---|---|---|
| Skittles, Tropical Splash, Caribbean Paradise | Owner flavor-card photos on Google Business (g21, g22, g61) | first-party |
| Açaí Berry, Orange | "National Hydration Day" owner post (g02) | first-party |
| Memorial Day Tea | Owner post (g03) | first-party |
| Bubbles | Owner post (g42) | first-party |
| Lucky Me Gotta Tea | Sticker on cups in owner photo (g01) | first-party (slogan, not a flavor) |
| Viva Las Vegas (Margarita · Strawberry · Cranberry · Limeade) | Instagram post 2026-08-31 | first-party |
| Wondermelon, Hurricane Huda | Customer reviews via search summary | second-hand |
| Sour Gummy Worm | Google review (Ashlee N.) | second-hand |
| Chocolate Brownie shake | Google review (Mike G.) | second-hand |
Hours: door decal in g08 reads "M-F: 7am-7pm · Sat-Sun: 9am-5pm".
