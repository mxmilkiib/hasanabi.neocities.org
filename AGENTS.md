# AGENTS.md

## Deploying

Run `./deploy.sh` - never `neocities-deploy` directly. The script
renders the twtch.neocities.org variant (same tree, per-host brand
swapped into the static head metas and manifest.json) into the sibling
`../twtch.neocities.org/` dir that site's deploy path points at, then
deploys every configured site. A raw `neocities-deploy deploy` pushes a
stale-but-branded twtch copy, not a wrong-branded one - it just skips
the re-render.

## Layout

- `index.html` - the whole client: markup, CSS, JS in one file.
- `twitch-chat-relay` repo (sibling project) - the IRC-over-WS relay the
  page embeds as an iframe; served from mxmilkiib.github.io.
- Per-host values in `index.html` map on `location.hostname`:
  `TW_CLIENT_IDS` (oauth app), `SITE_NAMES` (brand label).
