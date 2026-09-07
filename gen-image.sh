#!/bin/bash
# gen-image.sh <out.png> <prompt> [ref-image ...]   — Nano Banana Pro, 16:9, 2k. Mechanical lane.
OUT=$1; PROMPT=$2; shift 2
ARGS=()
for r in "$@"; do ARGS+=(--image-references "$r"); done
# validate arg spelling for free via cost
if higgsfield generate cost nano_banana_pro --prompt x --aspect_ratio 16:9 --resolution 2k >/dev/null 2>&1; then AR=--aspect_ratio; else AR=--aspect-ratio; fi
RAW=$(higgsfield generate create nano_banana_pro --prompt "$PROMPT" $AR 16:9 --resolution 2k "${ARGS[@]}" --wait --wait-timeout 10m --wait-interval 5s --json 2>&1)
echo "$RAW" > "${OUT%.png}.json"
URL=$(echo "$RAW" | grep -oE 'https://[^" ]+\.(png|jpg|jpeg|webp)[^" ]*' | tail -1)
if [ -z "$URL" ]; then echo "NO URL — raw tail:"; echo "$RAW" | tail -20; exit 1; fi
curl -fsSL -o "$OUT" "$URL" && echo "saved $OUT ($(stat -c%s "$OUT") bytes) from $URL"
