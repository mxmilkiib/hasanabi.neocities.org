# HasanAbi Chat Thing

A compact, customizable Twitch chat page for [HasanAbi](https://www.twitch.tv/hasanabi),
hosted on Neocities. Live at <https://hasanabi.neocities.org/>.

The project comes in two parts: the frontend
([hasanabi.neocities.org](https://github.com/mxmilkiib/hasanabi.neocities.org),
this repo — a single `index.html`) and the backend chat relay
([twitch-chat-relay](https://github.com/mxmilkiib/twitch-chat-relay),
also a single `index.html`, hosted on GitHub Pages).

## Why two parts

Neocities serves pages with a strict
[Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP):

    connect-src 'self' data: blob:

That blocks the WebSocket connection to Twitch IRC (`irc-ws.chat.twitch.tv`),
so the official Twitch embed, jChat, and any direct socket are all impossible.
`frame-src` is unrestricted though, so the page embeds a hidden iframe relay
hosted on GitHub Pages (which sends no CSP) and talks to it with `postMessage`.

The split is therefore by network privilege, not by concern: the frontend
owns all presentation and state, while the relay owns every outbound
connection. Because the relay learns its channel from the `join` message
rather than anything hardcoded, it is channel-agnostic — any page on any
CSP-locked host can embed the same iframe for any Twitch channel, one
channel per iframe instance. The hasanabi specifics all live in this file;
the relay could just as well serve a completely different channel page.

## Backend — `twitch-chat-relay` (GitHub Pages)

Repo: <https://github.com/mxmilkiib/twitch-chat-relay> — also a single
`index.html`, loaded as a hidden iframe from
`https://mxmilkiib.github.io/twitch-chat-relay/`.

Channel-agnostic by design: it takes the target channel from the embedder's
`join` message and derives everything else from it. It does the network work
the CSP forbids on Neocities:

- Connects to Twitch IRC over WebSocket as an anonymous `justinfan`
  user, requests `tags` + `commands` capabilities, handles
  PING/RECONNECT, and rejoins with exponential backoff.
- Polls [DecAPI](https://decapi.me) every 60s for uptime, viewer count
  and title (no auth needed).
- Fetches [ivr.fi](https://api.ivr.fi) user info (`lastBroadcast`),
  the 7TV/BTTV/FFZ emote sets, and the latest VOD via Twitch's public
  GraphQL endpoint for exact stream start/end times.

### Message protocol

Parent → relay: `{type: 'join', channel}`

Relay → parent:

- `{type: 'status', state}` — connecting / connected / reconnecting
- `{type: 'lines', lines[]}` — raw IRC lines
- `{type: 'stream', uptime, viewers, title}` — decapi poll result
- `{type: 'emotes', emotes, emoteSrc, zeroWidth, badges, lastBroadcast,
  lastVod}` — emote map + sources + badge sets + stream history,
  refetched every 10 minutes
- `{type: 'nitter', host}` — fastest healthy nitter instance from
  status.d420.de, rechecked every 15 minutes

## Frontend — `index.html` (this repo, on Neocities)

Everything runs client-side in one file — no build step, no framework,
no dependencies beyond CDN-hosted fonts:

- **Chat rendering** — raw Twitch IRC lines parsed into rows: timestamps,
  linked names, real badge icons (mod, VIP, sub flair, bits, founder…)
  with text chips as fallback, [sub N]/[bits]/[first] chips, reply chips
  with jump-to-original, emote retokenization. `/me` actions, `!command`
  and `#tag` lines render in italics (names, chips and timestamps stay
  upright), USERNOTICE subs/raids/gifts become dim italic notice rows,
  and CLEARCHAT/NOTICE events show timeouts, bans and channel notices.
- **Name colors** — the chatter's own Twitch color when set, a
  hash-derived palette colour otherwise; either way the luminance is
  nudged so names stay legible on the active theme (the console theme
  ignores chatter colors for its phosphor-green palette).
- **Emotes** — native Twitch `emotes` tags rendered as animated v2
  images (static fallback), cheermotes on bit messages, plus 7TV, BTTV
  and FFZ sets including animated FFZ emotes (name → CDN URL map
  supplied by the relay). Zero-width 7TV emotes stack onto the previous
  one, tooltips name the source set, and emote-only messages render
  large.
- **Header** — stream status dot (live / idle-gold / offline); the SVG
  favicon is rebuilt in the dot's computed color so the tab icon tracks
  stream state per theme. Uptime, viewers, title on hover; offline shows
  last-run info; ROOMSTATE chat modes (slow, follow age, emote-only,
  subs-only, r9k).
- **Graph** — messages-per-second sparkline with 10s/minute ticks and
  red glorp/F bursts; persisted across reloads.
- **Controls** — themes, zebra striping, graduated text shadow, font
  picker (incl. dyslexia-friendly), font size, line height, row lines,
  sub-chip alignment, page-flip two-column mode, minimizable header,
  help panel. All persisted in `localStorage`; every option answers to
  click, shift+click (reverse) and the scroll wheel.
- **Scrolling** — the log follows new messages only while at the
  bottom; scrolling up releases it and shows a jump-to-latest button
  (one per column in split mode).
- **Formatting** — mention highlighting, GLORP/F red rows, channel-point
  tints, fossabot/blammobot name shimmer and game-line styling, braille
  art restacking, image/GIF/Giphy embeds, Nitter link rewriting for
  Twitter/X.
- **Persistence** — last 250 rows, stream run history and graph samples
  survive reloads via `localStorage`.
- **URL options** — query params apply a configuration on top of (and
  into) the saved one, e.g. `?split&theme=dark&size=18&font=inter`.
  Keys: `split`, `min`, `theme`, `font`, `size`, `lh`, `zebra`, `lines`,
  `times`, `shadow`, `sub` (right/left/hidden), `eonly` (inline/right/off),
  `help` (off/panel/labels). Booleans take `=0` to force off.
- **Performance** — incoming lines queue and flush once per animation
  frame; the log is capped at 250 rows.

## Deploy

    neocities-deploy deploy -s hasanabi.neocities.org

Using [neocities-deploy](https://github.com/kugland/neocities-deploy)
([AUR package](https://aur.archlinux.org/packages/neocities-deploy-bin)).
The relay deploys automatically via GitHub Pages on push.

## License

AGPL-3.0 — see [LICENSE](LICENSE).
