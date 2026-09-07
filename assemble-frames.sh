#!/bin/bash
# assemble-frames.sh — mechanical lane, no model.
# For each mastered clip: extract every 2nd frame at 1280w as WebP into site/frames/NN/, build posters
# from the 2k keyframes, and write site/js/manifest.js with the frame counts. Prints seam colours.
set -o pipefail
cd "$(dirname "$0")"
DRINKS=(01-wondermelon 02-hurricane-huda 03-sour-gummy-worm 04-viva-las-vegas 05-chocolate-brownie)
mkdir -p site/frames site/img site/js
MAN="window.FRAMES = {"
for D in "${DRINKS[@]}"; do
  NN=${D%%-*}
  [ -r "clips/$D.mp4" ] || { echo "missing clips/$D.mp4"; exit 1; }
  rm -rf "site/frames/$NN"; mkdir -p "site/frames/$NN"
  ffmpeg -v error -i "clips/$D.mp4" -vf "select='not(mod(n\,2))',scale=1280:-2" -vsync vfr -c:v libwebp -quality 82 -compression_level 6 "site/frames/$NN/f_%03d.webp"
  COUNT=$(ls "site/frames/$NN" | wc -l | tr -d ' ')
  SIZE=$(du -sh "site/frames/$NN" | cut -f1)
  echo "$D: $COUNT frames, $SIZE"
  MAN+="\"$NN\":$COUNT,"
  # posters: 2560w hero-grade + 900w card
  ffmpeg -y -v error -i "keyframes/$D.png" -vf scale=2560:-2 -c:v libwebp -quality 86 "site/img/$NN-poster.webp"
  ffmpeg -y -v error -i "keyframes/$D.png" -vf scale=900:-2 -c:v libwebp -quality 84 "site/img/$NN-card.webp"
done
MAN="${MAN%,}};"
echo "$MAN" > site/js/manifest.js
echo "wrote site/js/manifest.js: $MAN"
# corner colour of the hero frame (page black must match)
ffmpeg -v error -i site/frames/01/f_001.webp -vf "crop=64:64:0:0,scale=1:1" -frames:v 1 -f rawvideo -pix_fmt rgb24 - | xxd -p | cut -c1-6 | sed 's/^/hero corner colour: #/'
ffmpeg -v error -i site/frames/01/f_001.webp -vf "crop=iw:ih*0.08:0:ih*0.92,scale=1:1" -frames:v 1 -f rawvideo -pix_fmt rgb24 - | xxd -p | cut -c1-6 | sed 's/^/hero bottom strip colour: #/'
du -sh site/frames site/img
