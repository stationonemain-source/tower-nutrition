#!/bin/bash
# assemble-float.sh [names...] — union matte: (Video Background Remover silhouette) ∪ (loose black key of the original)
#   → keeps the cup fully, keeps floating ice/droplets, drops the baked-in glow halo, fills the remover's holes.
# Every 2nd frame → 1280w alpha WebP → site/frames/NN/. Keyframes → alpha posters. Mechanical lane — no model.
set -o pipefail
NAMES=${@:-"01-wondermelon 02-hurricane-huda 03-sour-gummy-worm 04-viva-las-vegas 05-chocolate-brownie"}
LOOSE="colorkey=0x000000:0.34:0.14"
for N in $NAMES; do
  ID=${N%%-*}; SRC=clips/float/$N.mp4; MAT=clips/float/$N-alpha.mp4
  [ -r "$SRC" ] || { echo "[$N] missing $SRC"; continue; }
  OUT=site/frames/$ID; rm -rf "$OUT"; mkdir -p "$OUT"
  if [ -r "$MAT" ]; then
    ffmpeg -v error -i "$SRC" -i "$MAT" -filter_complex "[1:v]format=gray,lutyuv=y='if(gt(val,10),255,0)',boxblur=1:1[A];[0:v]format=rgba,$LOOSE,alphaextract[B];[A][B]blend=all_mode=lighten,format=gray[M];[0:v][M]alphamerge,select='not(mod(n\,2))',scale=1280:-2:flags=lanczos" -vsync vfr -c:v libwebp -pix_fmt yuva420p -quality 82 -compression_level 5 "$OUT/f_%03d.webp"
    MODE=union
  else
    ffmpeg -v error -i "$SRC" -vf "select='not(mod(n\,2))',format=rgba,colorkey=0x000000:0.07:0.06,scale=1280:-2:flags=lanczos" -vsync vfr -c:v libwebp -pix_fmt yuva420p -quality 82 -compression_level 5 "$OUT/f_%03d.webp"
    MODE=key-only
  fi
  echo "[$N] frames: $(ls "$OUT" | wc -l) ($MODE)  $(du -sh $OUT | cut -f1)"
  KF=keyframes/float/$N.png
  if [ -r "$KF" ]; then
    W=2560; [ "$ID" = "01" ] && W=3200
    # keyframe: loose key only (its halo is soft) but protect the cup by unioning a tight key of the saturated core
    ffmpeg -y -v error -i "$KF" -filter_complex "[0:v]format=rgba,$LOOSE,alphaextract[B];[0:v]format=rgba,colorkey=0x000000:0.07:0.06,alphaextract,erosion,erosion,erosion,erosion,dilation,dilation,dilation,dilation[C];[B][C]blend=all_mode=lighten,format=gray[M];[0:v][M]alphamerge,scale=$W:-2:flags=lanczos" -c:v libwebp -pix_fmt yuva420p -quality 86 -update 1 site/img/$ID-poster.webp
    ffmpeg -y -v error -i site/img/$ID-poster.webp -vf "scale=1000:-2:flags=lanczos" -c:v libwebp -pix_fmt yuva420p -quality 84 -update 1 site/img/$ID-card.webp
    echo "[$N] posters: $(stat -c%s site/img/$ID-poster.webp)B / $(stat -c%s site/img/$ID-card.webp)B"
  fi
done
python - <<'PY'
import os,json
m={}
for d in sorted(os.listdir('site/frames')):
    p=os.path.join('site/frames',d)
    if os.path.isdir(p): m[d]=len([f for f in os.listdir(p) if f.endswith('.webp')])
open('site/js/manifest.js','w').write('window.FRAMES='+json.dumps(m)+';\n'); print('manifest', m)
PY
