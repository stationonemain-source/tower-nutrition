#!/bin/bash
# cut-cup.sh <src.jpg> <crop w:h:x:y> <out.png> [threshold=232]
# Real Tower photos are shot on white. Discrete passes on purpose: chaining lutyuv straight into floodfill in one
# graph silently leaves the seed unfilled, so each stage is written out and re-read.
#   1 threshold : background -> 0, subject -> 255 (raise the threshold for pale subjects like a cream shake)
#   2 flood x10 : a full-height cup splits the background into disconnected pockets, so seed every corner
#                 AND every edge midpoint; one seed only ever clears the region it lands in
#   3 binarise  : anything not 128 is subject; open + feather the edge
#   4 merge     : the original crop + that mask
set -o pipefail
SRC=$1; CROP=$2; OUT=$3; TH=${4:-232}; B="${OUT%.png}"
W=${CROP%%:*}; R=${CROP#*:}; H=${R%%:*}
ffmpeg -y -v error -i "$SRC" -vf "crop=$CROP,format=gray,lutyuv=y='if(gt(val,$TH),0,255)'" -frames:v 1 -update 1 "$B-1.png" || exit 1
IN="$B-1.png"; n=0
for SEED in "0:0" "$((W-1)):0" "0:$((H-1))" "$((W-1)):$((H-1))" "$((W/2)):0" "$((W/2)):$((H-1))" "0:$((H/2))" "$((W-1)):$((H/2))" "$((W-1)):$((H/4))" "$((W-1)):$((3*H/4))"; do
  n=$((n+1)); X=${SEED%%:*}; Y=${SEED#*:}
  ffmpeg -y -v error -i "$IN" -vf "format=gray,floodfill=x=$X:y=$Y:s0=0:s1=0:s2=0:s3=0:d0=128:d1=128:d2=128:d3=128" -frames:v 1 -update 1 "$B-f$n.png" || exit 1
  IN="$B-f$n.png"
done
ffmpeg -y -v error -i "$IN" -vf "format=gray,lutyuv=y='if(eq(val,128),0,255)',erosion,dilation,boxblur=1:1" -frames:v 1 -update 1 "$B-m.png" || exit 1
ffmpeg -y -v error -i "$SRC" -i "$B-m.png" -filter_complex "[0:v]crop=$CROP[c];[c][1:v]alphamerge,format=rgba" -frames:v 1 -update 1 -pix_fmt rgba "$OUT" || exit 1
rm -f "$B-1.png" "$B-f"*.png "$B-m.png"
echo "$(basename $OUT) $(ffprobe -v error -show_entries stream=width,height -of csv=p=0 $OUT) th=$TH"
