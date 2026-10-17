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

rsync -a --delete --exclude='/.git' "$SRC/" "$OUT/"

# twtch reads generic - no hasanabi references in the unfurl text
DESC='A compact, customisable Twitch chat client - real emotes, badges, replies, stream video, themes, danmaku, multi-channel logs and link previews.'
sed -i "/<head>/,/<\/head>/ {
  s/HasanAbi Chat Thing/Twtch Chat Thing/g
  s/Hasan Chat/Twtch Chat/g
  s|hasanabi\.neocities\.org|twtch.neocities.org|g
  s|\(description\" content=\"\)[^\"]*|\1$DESC|
}" "$OUT/index.html"

sed -i "s/\"name\": \"HasanAbi Chat Thing\"/\"name\": \"Twtch Chat Thing\"/
        s/\"short_name\": \"Hasan Chat\"/\"short_name\": \"Twtch Chat\"/
        s/\"description\": \"[^\"]*\"/\"description\": \"$DESC\"/" "$OUT/manifest.json"

# twtch's og card renders from its own generic source (og-src-twtch.svg)
# - the deployed og-src.svg matches the deployed png
cp "$SRC/og-src-twtch.svg" "$OUT/og-src.svg"
(cd "$OUT" && rsvg-convert -w 1200 -h 630 -o og.png og-src.svg)

neocities-deploy deploy "$@"
