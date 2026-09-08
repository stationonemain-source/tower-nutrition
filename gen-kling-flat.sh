#!/bin/bash
# gen-kling.sh <name> <start-image> <prompt>  — Kling 3.0 Turbo 1080p 5s from a start image, then Video Background Remover (1 credit).
set -o pipefail
NAME=$1; START=$2; PROMPT=$3
mkdir -p clips/flat
echo "[$NAME] kling 1080p..."
RAW=$(higgsfield generate create kling3_0_turbo --prompt "$PROMPT" --start-image "$START" --duration 5 --resolution 1080p --aspect_ratio 16:9 --wait --wait-timeout 20m --wait-interval 6s --json 2>&1)
echo "$RAW" > clips/flat/$NAME.json
URL=$(echo "$RAW" | grep -oE '"result_url": *"[^"]+"' | head -1 | grep -oE 'https://[^"]+'); [ -n "$URL" ] || URL=$(echo "$RAW" | grep -oE 'https://[^" ]+\.mp4[^" ]*' | tail -1)
[ -n "$URL" ] || { echo "[$NAME] FAILED (no url):"; echo "$RAW" | tail -8; exit 1; }
curl -fsSL -o clips/flat/$NAME.mp4 "$URL" || exit 1
echo "[$NAME] clip: $(ffprobe -v error -select_streams v -show_entries stream=width,height,nb_frames,r_frame_rate -of csv=p=0 clips/flat/$NAME.mp4)"
echo "[$NAME] background remover..."
RAW2=$(higgsfield generate create video_background_remover --video-references clips/flat/$NAME.mp4 --wait --wait-timeout 20m --wait-interval 6s --json 2>&1)
echo "$RAW2" > clips/flat/$NAME-alpha.json
URL2=$(echo "$RAW2" | grep -oE '"result_url": *"[^"]+"' | head -1 | grep -oE 'https://[^"]+'); [ -n "$URL2" ] || URL2=$(echo "$RAW2" | grep -oE 'https://[^" ]+\.(mp4|webm|mov)[^" ]*' | tail -1)
[ -n "$URL2" ] || { echo "[$NAME] BG REMOVE FAILED:"; echo "$RAW2" | tail -8; exit 2; }
EXT=$(echo "$URL2" | grep -oE '\.(mp4|webm|mov)' | head -1 | tr -d .); [ -n "$EXT" ] || EXT=mp4
curl -fsSL -o clips/flat/$NAME-alpha.$EXT "$URL2" || exit 2
echo "[$NAME] alpha: $EXT $(ffprobe -v error -select_streams v -show_entries stream=codec_name,pix_fmt,width,height,nb_frames -of csv=p=0 clips/flat/$NAME-alpha.$EXT)"
