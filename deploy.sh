#!/usr/bin/env bash
# Deploys every configured neocities site. The twtch mirror serves the
# same tree with its own brand baked into the static head metas and
# manifest - scrapers and no-JS viewers read these before any runtime
# swap can run, so the copy is rendered into a sibling dir first and
# its site path points there. Raw neocities-deploy still works, it
# just pushes the last rendered twtch copy.
set -euo pipefail
SRC="$(cd "$(dirname "$0")" && pwd)"
OUT="$SRC/../twtch.neocities.org"

# og-src.svg and og.png are excluded - the script owns them for twtch
# (generated below), so rsync must not overwrite the rendered pair
rsync -a --delete --exclude='/.git' --exclude='/og-src.svg' --exclude='/og.png' "$SRC/" "$OUT/"

# twtch reads generic - no hasanabi references in the unfurl text
DESC='A compact, customisable Twitch chat client - real emotes, badges, replies, stream video, themes, danmaku, multi-channel logs and link previews.'
sed -i "/<head>/,/<\/head>/ {
  s/HasanAbi Chat Thing/Twtch Chat Thing/g
  s/Hasan Chat/Twtch Chat/g
  s|hasanabi\.neocities\.org|twtch.neocities.org|g
  s|\(description\" content=\"\)[^\"]*|\1$DESC|
}" "$OUT/index.html"

# the twtch note row in the help panel shows only on the mirror - the
# help rows are display:grid, which outranks the hidden attribute, so
# the switch is an inline display none->block. a missing marker means
# the source row drifted - fail loudly like the og card does
sed -i 's|id="twtchNote" style="display:none|id="twtchNote" style="display:block|' "$OUT/index.html"
grep -q 'id="twtchNote" style="display:block' "$OUT/index.html" || { echo "deploy: twtchNote marker drifted" >&2; exit 1; }

sed -i "s/\"name\": \"HasanAbi Chat Thing\"/\"name\": \"Twtch Chat Thing\"/
        s/\"short_name\": \"Hasan Chat\"/\"short_name\": \"Twtch Chat\"/
        s/\"description\": \"[^\"]*\"/\"description\": \"$DESC\"/" "$OUT/manifest.json"

# twtch's og card is generated from og-src.svg rather than kept as a
# second source - drop the avatar and hasan text, swap the brand and
# domain. the generated svg is content-cached: rsvg-convert only
# re-runs when the card actually changed. any 'hasan' left means
# og-src.svg drifted past these transforms - fail loudly
TMP_SVG=$(mktemp)
trap 'rm -f "$TMP_SVG"' EXIT
sed 's/HasanAbi Chat Thing/Twtch Chat Thing/
     s|hasanabi\.neocities\.org|twtch.neocities.org|g
     s|<tspan fill="#a9a9b4"> for </tspan><tspan fill="#b9a5f0">twitch.tv/hasanabi</tspan>||
     s|client, orientated around the <tspan fill="#e8e8ea">Hasan Piker</tspan>|chat client - real emotes, badges, replies,|
     s|stream, aka the <tspan fill="#e8e8ea">Piker Broadcasting Service</tspan> (<tspan fill="#e8e8ea">PBS</tspan>);|stream video, themes, danmaku, link peeks|
     s|a general/second-screen/accessibility web tool with|and multi-channel logs|
     /hasan-avatar\.jpg/d
     /organizing info, media links, multi-stream support,/d
     /and other extras/d' "$SRC/og-src.svg" > "$TMP_SVG"
grep -qi 'hasan' "$TMP_SVG" && { echo "deploy: og-src.svg drifted - twtch card still has hasan references" >&2; exit 1; }
if [ ! -f "$OUT/og.png" ] || ! cmp -s "$TMP_SVG" "$OUT/og-src.svg"; then
  mv "$TMP_SVG" "$OUT/og-src.svg"
  (cd "$OUT" && rsvg-convert -w 1200 -h 630 -o og.png og-src.svg)
fi

neocities-deploy deploy "$@"
