# hasanabi.neocities.org

A compact, customizable Twitch chat page for [HasanAbi](https://www.twitch.tv/hasanabi),
hosted on Neocities. Live at <https://hasanabi.neocities.org/>.

The project comes in two parts: the frontend
([hasanabi.neocities.org](https://github.com/mxmilkiib/hasanabi.neocities.org),
this repo — a single `index.html`) and the backend chat relay
([twitch-chat-relay](https://github.com/mxmilkiib/twitch-chat-relay),
also a single `index.html`, hosted on GitHub Pages). See
[Why two parts](#why-two-parts) for the reason.

## Why two parts

Neocities serves pages with a strict Content Security Policy:

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

## Frontend — `index.html` (this repo, on Neocities)

Everything runs client-side in one file:

- **Chat rendering** — raw Twitch IRC lines parsed into rows: timestamps,
  linked names, badges/role chips ([ mod. ], [sub N], [bits], [first]),
  reply chips with jump-to-original, emote retokenization.
- **Emotes** — native Twitch `emotes` tags plus 7TV, BTTV and FFZ sets
  (name → CDN URL map supplied by the relay).
- **Header** — stream status dot (live / idle-gold / offline), uptime,
  viewers, title on hover; offline shows last-run info; ROOMSTATE chat
  modes (slow, follow age, emote-only, subs-only, r9k).
- **Graph** — messages-per-second sparkline with 10s/minute ticks and
  red glorp/F bursts; persisted across reloads.
- **Controls** — themes, zebra striping, graduated text shadow, font
  picker (incl. dyslexia-friendly), font size, line height, row lines,
  sub-chip alignment, page-flip two-column mode, minimizable header,
  help panel. All persisted in `localStorage`.
- **Formatting** — mention highlighting, GLORP/F red rows, channel-point
  tints, fossabot/blammobot name shimmer and game-line styling, braille
  art restacking, image/GIF embeds, Nitter link rewriting for Twitter/X.
- **Persistence** — last 250 rows, stream run history and graph samples
  survive reloads via `localStorage`.

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
- `{type: 'emotes', emotes, lastBroadcast, lastVod}` — emote map +
  stream history, refetched every 10 minutes

## Deploy

    neocities-deploy deploy -s hasanabi.neocities.org

Using [neocities-deploy](https://github.com/kugland/neocities-deploy)
([AUR package](https://aur.archlinux.org/packages/neocities-deploy-bin)).
The relay deploys automatically via GitHub Pages on push.

## License

AGPL-3.0 — see [LICENSE](LICENSE).
