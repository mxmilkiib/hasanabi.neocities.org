# HasanAbi Chat Thing

A compact, customizable Twitch chat page for [HasanAbi](https://www.twitch.tv/hasanabi),
hosted on Neocities — orientated around the Hasan Piker stream, aka the
Piker Broadcasting Service (PBS). An alt-UI, second-screen/accessibility tool,
organising, media and other resources, & more! Live at
<https://hasanabi.neocities.org/>.

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

Parent → relay: `{type: 'join', channel}`, `{type: 'backfill'}`,
`{type: 'auth', token}` (or `token: null` to log out),
`{type: 'send', text, replyTo}` — posts a chat message once
authenticated (`replyTo` attaches a `reply-parent-msg-id` tag),
`{type: 'tweet', id}` — fetches an X/Twitter preview via api.fxtwitter.com

Relay → parent:

- `{type: 'status', state}` — connecting / connected / reconnecting
- `{type: 'lines', lines[]}` — raw IRC lines, live or backfilled
- `backfill` — on request, the relay fetches the backlog from
  recent-messages.robotty.de (the same service Chatterino uses) and
  forwards it as `lines`; the page skips already-rendered msg ids
- `{type: 'stream', uptime, viewers, title}` — decapi poll result
- `{type: 'emotes', emotes, emoteSrc, zeroWidth, badges, lastBroadcast,
  lastVod}` — emote map + sources + badge sets + stream history,
  refetched every 10 minutes
- `{type: 'nitter', host}` — fastest healthy nitter instance from
  status.d420.de, rechecked every 15 minutes
- `{type: 'wscause', code, reason}` — why the Twitch socket last closed,
  sent with each `reconnecting` status; the page shows it in the header
- `{type: 'repo', stars, created, pushed}` — GitHub metadata for the
  source row of the help popup
- `{type: 'auth', login}` (or `{type: 'auth', error}`) — after `auth`, the
  relay validates the token at id.twitch.tv, reconnects the socket with
  the user's credentials, and reports the resolved login
- `{type: 'tweet', id, tweet}` — preview data for a tweet link

Optional login uses Twitch's implicit OAuth grant (the Twitch button in the header) — a
pure client-side flow, so no secret ships in the page. `TWITCH_CLIENT_ID`
in `index.html` must be an app registered at dev.twitch.tv with this
page's URL as its redirect URI. Chat-scoped tokens live in localStorage
until logout; channel rules (slow mode etc.) apply to sent messages and
rejections come back as ordinary `[notice]` rows.

## Frontend — `index.html` (this repo, on Neocities)

Everything runs client-side in one file — no build step, no framework,
no dependencies beyond CDN-hosted fonts:

- **Chat rendering** — raw Twitch IRC lines parsed into rows: timestamps,
  linked names, real badge icons (mod, VIP, sub flair, bits, founder…)
  with text chips as fallback, [sub N]/[bits]/[first] chips, replies
  quote the full original in a ruled block above the line (click it to
  jump to the original), emote retokenization. `/me` actions, `!command`
  and `#tag` lines render in italics (names, chips and timestamps stay
  upright), USERNOTICE subs/raids/gifts become dim italic notice rows,
  and CLEARCHAT/NOTICE events show timeouts, bans and channel notices
  (a room-wide `/clear` wipes rendered rows; a timeout or ban on the
  logged-in user also locks the chat input with a live countdown until
  it expires). Stretches the page wasn't
  watching — hidden tab, suspended timers, page closed — get a `· Nm gap
  · cause · start → end` notice so lost context is visible in the log.
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
  subs-only, r9k). The `–` button cycles three sizes: full →
  reduced (option buttons hide; `?`, `–` and the `▶` stream-play stay
  pinned at the right edge) → minimised, a 10px strip carrying just `–`
  that restores on click.
- **Graph** — messages-per-second sparkline with 10s/minute ticks and
  red glorp/F bursts; dim bands shade spans the page wasn't watching
  (suspended timers, reloads) instead of drawing them flat. It flexes
  to fill whatever header space is free (the whole bar in reduced mode)
  and re-rasterises to match its box so it stays sharp through resizes.
  Persisted across reloads.
- **Controls** — colour style palettes (brightness-ordered, each with a
  designed shade stop) plus a separate 9-stop shade axis
  (white → black, or system-following auto); the `◐` cycle swaps
  hue family alone while picking a chip also applies its shade, zebra
  striping, graduated text shadow, font picker (incl. dyslexia-friendly),
  font size, weight, line height, row separator shades, three-state
  timestamps (off / no seconds / seconds), sub-chip modes (right /
  compact `[NN]` / before badges / hidden), emote-only row modes,
  page-flip columns (two, or three in landscape), draggable stream-video
  overlay (its button turns green while playing, red when stopped),
  minimizable header, tabbed help panel (resources · authors ·
  config/help) with its own width and font-size controls. All
  persisted in `localStorage`; every option answers to click,
  shift+click (reverse) and the scroll wheel. In the popup the style and
  preset links render as live swatches — background, text colour and,
  for presets, the bundled font.
- **Sending** — optional Twitch login (the Twitch button, implicit OAuth — no
  secret ships in the page) enables a chat input bar. `/me` is wrapped as a
  CTCP ACTION so it renders as a proper action line; hovering a row
  shows `↩` to reply — the pending-reply bar shows the target and cancels
  on `Esc`, and the send carries `reply-parent-msg-id`; Twitch prepends
  the `@login` itself, so only the local echo spells it out. Local echoes render instantly and are
  adopted in place when the real line replays. `↑`/`↓` in the input walk
  sent messages like an IRC client, stashing the draft on the first `↑`
  and restoring it once `↓` walks back past the newest entry.
- **Emote picker** — `☻` opens a Chatterino-style grid above the chat
  box: 7TV / BTTV / FFZ / Twitch / emoji sections with search, resizable
  from its left and top edges (size persists). Clicking inserts at the
  caret and the panel stays open until `☻` or `Esc`.
- **Channels** — `?channel=login` points chat, stream embed and status
  at another streamer for the visit; history, graph and tab-sync keys
  get a per-channel suffix so streams don't bleed into each other, and
  the OAuth round-trip carries the channel in `state`. The resources
  tab's twitch streams row links each streamer with a `*` that switches
  to them.
- **Links view** — `🔗` filters the log to rows carrying a URL and
  shows each link only once (a reposted URL hides as a duplicate);
  click again to restore. Session-only, not saved
- **Scrolling** — the log follows new messages only while at the
  bottom; scrolling up releases it and shows a jump-to-latest button
  with a count of rows below the fold (one per column in split mode).
- **Formatting** — mention highlighting (your own login joins the
  keyword set when logged in), GLORP/F red rows, channel-point
  tints, fossabot/blammobot name shimmer and game-line styling, braille
  art restacking, image/GIF/Giphy embeds, X/Twitter preview cards via
  fxtwitter (text skipped when a bot like fossabot already pasted it) (profile links fall back to Bird.makeup when nitter is
  down). Mentions landing while the page is unfocused queue on a
  clickable `@N` chip in the header — click to jump to each, ⇧click
  clears.
- **Persistence** — last 1000 rows (including gap notices), stream run
  history and graph samples survive reloads via `localStorage`.
- **Multi-tab** — option changes and login/logout propagate to other
  open copies through `storage` events; sent-message echoes broadcast
  over a `BroadcastChannel` so every copy renders them at once.
- **PWA / resume** — installable (manifest + pass-through service
  worker); an installed standalone window survives backgrounding better
  than a tab. Regardless, on wake or reconnect the page asks the relay
  for missed lines via recent-messages.robotty.de, so the log backfills
  rather than staying truncated.
- **URL options** — query params apply a configuration on top of (and
  into) the saved one, e.g. `?split&theme=dark&size=18&font=inter`.
  Keys: `split` (2 panes, or `split=3` on landscape screens), `min`,
  `style`, `shade` (0-8, `auto` follows the system; a bare `style` with
  no `shade` lands on the style's designed stop), `font`, `size`, `lh`,
  `wght` (300-700), `hfs` (header font px; unset = follow chat),
  `hpfs` (help popup font px), `hpw` (help popup width, `480`–`1600`), `pause` (hold the scroll while
  hovering a row), `channel` (any twitch login),
  `zebra`, `lines` (0-3 separator shades),
  `times` (on, `nosec`, or `=0` off), `shadow`, `video`,
  `sub` (right/num-right/left/num-left/hidden), `eonly` (inline/right/off),
  `help` (off/panel/labels/both). Booleans take `=0` to force off.
  `kw` is a comma-separated keyword list; lines containing one get a
  green edge (e.g. `?kw=malkiii,raid`). `self=1` puts an accent edge on
  one's own messages when logged in. `min=graph` selects the reduced
  header (option buttons hidden, rate graph across the bar); `min=1`
  minimises to a strip.
  `theme` names a preset bundle of all display options (`default`,
  `compact`, `print`, `cosy`, `cinema`, `phosphor`, `dyslexic`,
  `midnight`, `solar`, `minimal`, `retro`, `irc`, `gohu`, `heather`); a
  style name like `theme=dark` still selects just the palette, which
  is also what the retired preset names `paper`, `mirc` and `console`
  now resolve to. Presets never share a name with a style.
- **Help popup** — resources (re Hasan, news, yt channels, twitch
  streams, usa pol, the largest DSA chapter per state, left parties,
  organising, free software, open hardware, extra links), authors
  (era-grouped reading lists) and config/help,
  laid out in link columns whose count is capped by the popup's own
  width via container queries. The popup resizes from its edges and
  offers widths from 480 to 1600px.
- **Performance** — incoming lines queue and flush once per animation
  frame; the log is capped at 1000 rows.

## Deploy

    neocities-deploy deploy -s hasanabi.neocities.org

Using [neocities-deploy](https://github.com/kugland/neocities-deploy)
([AUR package](https://aur.archlinux.org/packages/neocities-deploy-bin)).
The relay deploys automatically via GitHub Pages on push.

## License

AGPL-3.0 — see [LICENSE](LICENSE).
