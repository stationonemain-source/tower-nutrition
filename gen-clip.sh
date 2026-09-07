#!/bin/bash
# gen-clip.sh <name> <start-image> <prompt> [resolution=720p] [mode=std]
# Seedance 2.0 turntable clip from a start image, audio OFF. Downloads, extracts first/last frames.
# Mechanical lane — no model.
set -o pipefail
NAME=$1; START=$2; PROMPT=$3; RES=${4:-720p}; MODE=${5:-std}
[ -r "$START" ] || { echo "start image not readable: $START"; exit 1; }
mkdir -p clips
echo "[$NAME] creating ($RES/$MODE, audio off)..."
RAW=$(higgsfield generate create seedance_2_0 --prompt "$PROMPT" --start-image "$START" \
  --duration 5 --resolution "$RES" --mode "$MODE" --generate-audio false --aspect_ratio 16:9 \
  --wait --wait-timeout 20m --wait-interval 6s --json 2>&1)
echo "$RAW" > "clips/$NAME.json"
URL=$(echo "$RAW" | grep -oE 'https://[^" ]+\.mp4[^" ]*' | tail -1)
if [ -z "$URL" ]; then echo "[$NAME] FAILED — no mp4 url (server-side failures are unbilled; retry). Tail:"; echo "$RAW" | tail -15; exit 1; fi
curl -fsSL -o "clips/$NAME.mp4" "$URL" || { echo "[$NAME] download failed"; exit 1; }
ffmpeg -y -v error -i "clips/$NAME.mp4" -vf "select=eq(n\,0)" -frames:v 1 -update 1 -q:v 1 "clips/$NAME-first.png"
ffmpeg -y -v error -sseof -0.05 -i "clips/$NAME.mp4" -update 1 -q:v 1 "clips/$NAME-last.png"
echo "[$NAME] saved: $(ffprobe -v error -select_streams v -show_entries stream=width,height,nb_frames,r_frame_rate -of csv=p=0 clips/$NAME.mp4)  $(stat -c%s clips/$NAME.mp4) bytes"
# start-vs-first-frame fidelity (should be high — the model must honour the start image)
S=$( (ffmpeg -i "$START" -i "clips/$NAME-first.png" -filter_complex "[0]scale=1280:720[a];[1]scale=1280:720[b];[a][b]ssim" -f null - 2>&1 || true) | grep -o 'All:[0-9.]*' | cut -d: -f2)
echo "[$NAME] start-image fidelity SSIM: ${S:-n/a}"
