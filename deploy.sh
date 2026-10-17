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

sed -i '/<head>/,/<\/head>/ {
  s/HasanAbi Chat Thing/Twtch Chat Thing/g
  s/Hasan Chat/Twtch Chat/g
  s|hasanabi\.neocities\.org|twtch.neocities.org|g
}' "$OUT/index.html"

sed -i 's/"name": "HasanAbi Chat Thing"/"name": "Twtch Chat Thing"/
        s/"short_name": "Hasan Chat"/"short_name": "Twtch Chat"/' "$OUT/manifest.json"

neocities-deploy deploy "$@"
