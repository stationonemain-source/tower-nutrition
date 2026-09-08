#!/bin/bash
# assemble-float.sh [names...] — union matte: (Video Background Remover silhouette) ∪ (loose black key of the original)
#   → keeps the cup fully, keeps floating ice/droplets, drops the baked-in glow halo, fills the remover's holes.
# Every 2nd frame → 1280w alpha WebP → site/frames/NN/. Keyframes → alpha posters. Mechanical lane — no model.
set -o pipefail
NAMES=${@:-"01-wondermelon 02-hurricane-huda 03-sour-gummy-worm 04-viva-las-vegas 05-chocolate-brownie"}
LOOSE="colorkey=0x000000:0.34:0.14"
for N in $NAMES; do
  ID=${N%%-*}; SRC=clips/flat/$N.mp4; MAT=clips/flat/$N-alpha.mp4
  [ -r "clips/flat/$N-up.mp4" ] && SRC="clips/flat/$N-up.mp4"   # Bytedance 2K upscale of the same clip, if present
  [ -r "$SRC" ] || { echo "[$N] no flat-lid clip yet — frames skipped (still path)"; rm -rf site/frames/$ID; }
  OUT=site/frames/$ID
  if [ -r "$SRC" ] && [ ! -r "$MAT" ]; then
    # FREE silhouette when no remover matte exists: blur → luma threshold → closing (fills the sticker text) — the cup and
    # ice are bright, the baked glow halo is dark, so the threshold keeps the former and drops the latter.
    echo "[$N] no remover matte — building a free luma silhouette"
    # blur → threshold → close small gaps → flood the EXTERIOR from (0,0) with grey → everything not grey is subject (holes filled)
    ffmpeg -y -v error -i "$SRC" -vf "format=gray,boxblur=3:1,lutyuv=y='if(gt(val,58),255,0)',dilation,dilation,dilation,floodfill=x=0:y=0:s0=0:s1=0:s2=0:s3=0:d0=128:d1=128:d2=128:d3=128,lutyuv=y='if(eq(val,128),0,255)',erosion,erosion,erosion" -c:v libx264 -crf 12 -pix_fmt yuv420p "clips/flat/$N-alpha.mp4" && MAT="clips/flat/$N-alpha.mp4"
  fi
  if [ -r "$SRC" ] && [ -r "$MAT" ]; then rm -rf "$OUT"; mkdir -p "$OUT"
    ffmpeg -v error -i "$SRC" -i "$MAT" -filter_complex "[1:v]format=gray,lutyuv=y='if(gt(val,10),255,0)',boxblur=1:1[A0];[0:v]format=rgba,$LOOSE,alphaextract[B];[A0][B]scale2ref[A][B2];[A][B2]blend=all_mode=lighten,format=gray[M];[0:v][M]alphamerge,select='not(mod(n\,2))',crop=iw*0.56:ih:iw*0.22:0,scale=-2:1080:flags=lanczos" -vsync vfr -c:v libwebp -pix_fmt yuva420p -quality 78 -compression_level 5 "$OUT/f_%03d.webp"
    echo "[$N] frames: $(ls "$OUT" | wc -l) (union)  $(du -sh $OUT | cut -f1)"
  fi
  KF=keyframes/flat/$N.png
  if [ -r "$KF" ]; then
    W=2560; [ "$ID" = "01" ] && W=3200
    # keyframe: loose key only (its halo is soft) but protect the cup by unioning a tight key of the saturated core
    ffmpeg -y -v error -i "$KF" -filter_complex "[0:v]format=rgba,$LOOSE,alphaextract[B];[0:v]format=rgba,colorkey=0x000000:0.07:0.06,alphaextract,dilation,dilation,dilation,dilation,dilation,dilation,dilation,dilation,dilation,dilation,dilation,dilation,erosion,erosion,erosion,erosion,erosion,erosion,erosion,erosion,erosion,erosion,erosion,erosion[C];[B][C]blend=all_mode=lighten,format=gray[M];[0:v][M]alphamerge,scale=$W:-2:flags=lanczos" -c:v libwebp -pix_fmt yuva420p -quality 86 -update 1 site/img/$ID-poster.webp
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
