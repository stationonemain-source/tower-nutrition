#!/bin/bash
# posters.sh — alpha posters: (image_background_remover silhouette, upscaled) ∪ (loose black key of the full-res still)
set -o pipefail
for N in 01-wondermelon 02-hurricane-huda 03-sour-gummy-worm 04-viva-las-vegas 05-chocolate-brownie; do
  ID=${N%%-*}; SRC=keyframes/float/$N.png; CUT=keyframes/float/$N-cut.png
  [ -r "$SRC" ] && [ -r "$CUT" ] || { echo "[$N] missing"; continue; }
  read W H < <(ffprobe -v error -show_entries stream=width,height -of csv=p=0 "$SRC" | tr , ' ')
  PW=2560; [ "$ID" = "01" ] && PW=3200
  ffmpeg -y -v error -i "$SRC" -i "$CUT" -filter_complex "[1:v]alphaextract,scale=${W}:${H}:flags=bicubic,lutyuv=y='if(gt(val,30),255,0)',boxblur=2:1[A];[0:v]format=rgba,colorkey=0x000000:0.5:0.16,alphaextract[B];[A][B]blend=all_mode=lighten,format=gray[M];[0:v][M]alphamerge,scale=${PW}:-2:flags=lanczos" -c:v libwebp -pix_fmt yuva420p -quality 86 -update 1 site/img/$ID-poster.webp
  ffmpeg -y -v error -i site/img/$ID-poster.webp -vf "scale=1000:-2:flags=lanczos" -c:v libwebp -pix_fmt yuva420p -quality 84 -update 1 site/img/$ID-card.webp
  echo "[$N] poster $(stat -c%s site/img/$ID-poster.webp)B  card $(stat -c%s site/img/$ID-card.webp)B"
done
