#!/bin/bash
# finish-kling.sh <name> <mp4-url-or-path> — Kling clip made on Circle's own account → clips/flat/<name>.mp4
#   → Higgsfield Video Background Remover (1 credit) → Bytedance 2K aigc upscale (0.2) → assemble-float.sh <name>
set -o pipefail
N=$1; SRC=$2; mkdir -p clips/flat
if [[ "$SRC" == http* ]]; then curl -fsSL -o "clips/flat/$N.mp4" "$SRC" || { echo "[$N] download failed"; exit 1; }; else cp "$SRC" "clips/flat/$N.mp4"; fi
echo "[$N] clip: $(ffprobe -v error -select_streams v -show_entries stream=width,height,nb_frames,r_frame_rate -of csv=p=0 clips/flat/$N.mp4)"
RAW=$(higgsfield generate create video_background_remover --video-references "clips/flat/$N.mp4" --wait --wait-timeout 25m --wait-interval 8s --json 2>&1)
URL=$(echo "$RAW" | grep -oE '"result_url": *"[^"]+"' | head -1 | grep -oE 'https://[^"]+'); [ -n "$URL" ] || { echo "[$N] remover failed:"; echo "$RAW" | tail -5; exit 2; }
curl -fsSL -o "clips/flat/$N-alpha.mp4" "$URL" && echo "[$N] matte ok"
RAW2=$(higgsfield generate create bytedance_video_upscale --video-references "clips/flat/$N.mp4" --resolution 2k --preset aigc --fps 24 --wait --wait-timeout 25m --wait-interval 8s --json 2>&1)
URL2=$(echo "$RAW2" | grep -oE '"result_url": *"[^"]+"' | head -1 | grep -oE 'https://[^"]+'); [ -n "$URL2" ] && curl -fsSL -o "clips/flat/$N-up.mp4" "$URL2" && echo "[$N] upscale ok: $(ffprobe -v error -show_entries stream=width,height -of csv=p=0 clips/flat/$N-up.mp4)" || echo "[$N] upscale skipped"
./assemble-float.sh "$N" 2>&1 | grep -E "^\[|manifest"
