# HasanAbi Chat Thing

A compact, customizable Twitch chat page for [HasanAbi](https://www.twitch.tv/hasanabi),
hosted on Neocities — orientated around the Hasan Piker stream, aka the
Piker Broadcasting Service (PBS). An alt-UI, second-screen/accessibility tool,
organising, media and other resources, & more! Live at
<https://hasanabi.neocities.org/>, mirrored on GitHub Pages at
<https://mxmilkiib.github.io/hasanabi.neocities.org/>.

In plainer terms: it is the stream's chat, liberated from twitch.tv. The
log renders in a single self-contained page that runs on a static host,
follows one along through suspends and reloads (backfilling whatever was
missed), draws a live messages-per-second graph, understands every major
emote ecosystem, and — after an optional Twitch login — replies, `/me`s
and chat history walkbacks work like a real IRC client. Beyond chat, the
page doubles as a curated hub: the help popup carries resources, news,
organising links and era-grouped author reading lists. Any other Twitch
channel can be pointed at with `?channel=login`, and a comma list
(`?channel=a,b,c`, up to 6) merges several rooms into one log — the first
channel stays focused (title, stream status, video, chat target, storage)
while each row carries a `#chan` chip that refocuses on click.

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
connection. Because the relay learns its channels from the `join` message
rather than anything hardcoded, it is channel-agnostic — any page on any
CSP-locked host can embed the same iframe for any Twitch channel. The
hasanabi specifics all live in this file; the relay could just as well
serve a completely different channel page.

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

Parent → relay:

| message | purpose |
|---|---|
| `{type: 'join', channels[]}` | set the channels to watch (a bare `channel` string still works); repeats diff JOIN/PART |
| `{type: 'backfill'}` | ask for the recent-messages backlog (every joined channel, merged by timestamp) |
| `{type: 'auth', token}` | log in (or `token: null` to log out) |
| `{type: 'send', channel, text, replyTo}` | post a chat message once authenticated; `replyTo` attaches a `reply-parent-msg-id` tag |
| `{type: 'tweet', id}` | fetch an X/Twitter preview via api.fxtwitter.com |
| `{type: 'twsets', ids}` | fetch Twitch emote-set metadata via ivr.fi |

Relay → parent:

- `{type: 'status', state}` — connecting / connected / reconnecting
- `{type: 'lines', lines[]}` — raw IRC lines, live or backfilled
- `backfill` — on request, the relay fetches the backlog from
  recent-messages.robotty.de (the same service Chatterino uses) and
  forwards it as `lines`; the page skips already-rendered msg ids
- `{type: 'stream', channel, uptime, viewers, title}` — decapi poll
  result, per joined channel
- `{type: 'emotes', channel, emotes, emoteSrc, zeroWidth, badges,
  lastBroadcast, lastVod, emoteUse, emoteAnim}` — per-channel emote map +
  sources + badge sets + stream history + per-emote channel usage counts
  (StreamElements chatstats) + animated-emote names, refetched every
  10 minutes (global sets are fetched once per cycle and merged in)
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
- `{type: 'twsets', key, sets}` — the emote-set metadata reply (`key`
  echoes the asked `ids`)

## Frontend — `index.html` (this repo, on Neocities)

Everything runs client-side in one file — no build step, no framework,
no dependencies beyond CDN-hosted fonts.

### Chat log

- Rows — timestamps, linked names, real badge icons (mod, VIP, sub
  flair, bits, founder…) with text chips as fallback, and `[sub N]` /
  `[bits]` / `[first]` chips.
- Replies — the full original is quoted in a ruled block above the
  line; click it to jump back to the source row.
- `/me` actions, `!command` and `#tag` lines render in italics (names,
  chips and timestamps stay upright).
- USERNOTICE subs/raids/gifts become dim italic notice rows;
  CLEARCHAT/NOTICE events show timeouts, bans and channel notices. A
  room-wide `/clear` wipes rendered rows, while a timeout or ban
  ghosts that user's rows in place (struck-through but readable,
  including own echoes); a timeout or ban on the logged-in user locks
  the chat input with a live countdown until it expires.
- Name colours — the chatter's own Twitch colour when set, a
  hash-derived palette colour otherwise; either way the luminance is
  nudged so names stay legible on the active theme (the console theme
  ignores chatter colours for its phosphor-green palette).
- Gap notices — stretches the page wasn't watching (hidden tab,
  suspended timers, page closed, socket dropped) get a
  `· Nm gap · cause · start → end` row so lost context stays visible.
- Whispers — `WHISPER` lines render in their own floating pane beside
  the log (needs a login carrying whisper scopes); an unread count
  badges a `✉` header chip that opens it, and `/w name text` replies
  through `#jtv` like other clients.
- Permalinks — clicking a row's timestamp copies a `?mid=` link;
  opening it scrolls to and flashes the row.

### Emotes

- Native Twitch `emotes` tags render as animated v2 images (static
  fallback); cheermotes on bit messages; 7TV, BTTV and FFZ sets
  including animated FFZ (the name → CDN URL map comes from the relay).
- Zero-width 7TV emotes stack onto the previous one.
- Emote-only rows render large (mode configurable: inline / pinned
  right / normal).
- Hovering an emote — in a row or in the picker — pops a card with the
  art at the provider's largest size plus the code and its source set
  (emoji cells show the glyph with their search keywords).

### Emote picker

- `☻` opens a Chatterino-style grid: 7TV / BTTV / FFZ / Twitch / emoji
  (~600 glyphs) sections with search, a `recent` row of the last 24
  used, per-source tab toggles, still/animated filters, and a `mix`
  toggle that merges every enabled source into one flat grid.
- Ordering is alphabetical or by usage — most recently used in chat
  first (StreamElements chatstats via the relay seed lifetime counts
  for tie-breaks; live session use updates both and persists across
  reloads). In mix mode anything used in the last minute pins to the
  very top; sectioned mode keeps recents atop their own section.
- In usage mode, dashed `2m`/`5m`/`10m`/`20m`/`30m`/`40m`/`50m`/`60m`
  cells mark where emotes were last used over that long ago — dim until
  recording has actually covered that span, then bold and
  accent-bordered — plus a solid accent square at the point recording
  began (everything below it was never seen). The `▤` age-rows mode
  gives each square its own row, and all the squares' borders breathe
  on a slow pulse so they catch the eye.
- Reshuffles animate emotes sliding to their new spots; a just-used
  emote flashes behind its cell, each use stepping the flash ~24° round
  the hue wheel so consecutive uses read as a spectral walk.
- `Aa` overlays each emote's code, `½x`/`¾x`/`1x`/`2x` buttons size the
  grid, and `hold` freezes usage reshuffles while the pointer is over
  the picker.
- The box resizes from its left and top edges and drags by a dotted
  grip strip (both persist); a `📌` pin keeps it open across chat-bar
  hides and reloads. All display options — names, size, sort, age rows,
  mix, hold, tabs, anim filter, geometry — ride the settings bundle,
  theme slots and copied URLs.
- Clicking inserts at the caret; `Esc` peels the topmost layer —
  picker first, then the help panel.

### Sending & the input bar

- Optional Twitch login (the Twitch button, implicit OAuth — no secret
  ships in the page) enables a chat input bar. Chat-scoped tokens live
  in localStorage until logout.
- A `➤` button sends for pointer/voice-only users; typing a character
  anywhere jumps into the box.
- `/me` is wrapped as a CTCP ACTION so it renders as a proper action
  line; slash commands pass through as Twitch reads them (`/timeout`,
  `/ban`, `/announce`, `/raid`…), dropping any pending reply tag.
- Hovering a row shows `↩` to reply — the pending-reply bar shows the
  target and cancels on `Esc`; the send carries `reply-parent-msg-id`.
  Twitch prepends the `@login` itself, so only the local echo spells
  it out.
- Local echoes render instantly and are adopted in place when the real
  line replays through backfill; they persist across reloads so a
  racing backlog can't eat a just-sent line.
- A plain click on a chatter's name types `@name ` at the input caret
  (modifier-clicks still open the profile).
- `@` at a word boundary opens a narrowing pick of recently seen nicks
  (freshest first, each in its chat colour) — tab/⇧tab walks it, enter
  or a click fills the name. `:word`, or any bare word of 3+ letters
  followed by tab, completes emote codes the same way, with a small
  preview beside each candidate.
- The box is a growing textarea — a wrapping draft gains a line at a
  time up to five before scrolling; ⇧`enter` writes a newline, plain
  `enter` sends.
- A character count sits beside the box — amber past ~200 chars (the
  guessed fossabot long-message cutoff; the real filter isn't public)
  and red near Twitch's 500 cap, with the box border tinting to match.
- Readline-style history: `↑`/`↓` in the input walk sent messages,
  stashing the draft on the first `↑` and restoring it once `↓` walks
  back past the newest entry; `↓` on a non-empty draft parks it as a
  navigable slot under whatever is sent next. The ring (100 deep,
  per channel) persists in `localStorage`, so `↑` after a reload still
  reaches older sends like an IRC client.
- Channel rules apply server-side — slow mode counts down in the input
  after each send (mods/VIPs exempt), and rejections arrive as
  ordinary `[notice]` rows.

### Header & graph

- Stream status dot (live / idle-gold / offline); the SVG favicon is
  rebuilt in the dot's computed colour so the tab icon tracks stream
  state per theme.
- Uptime, viewers, title on hover; offline shows last-run info;
  ROOMSTATE chat modes (slow, follow age, emote-only, subs-only, r9k).
- The `–` button cycles three sizes: full → reduced (option buttons
  hide; `?`, `–` and the `▶` stream-play stay pinned at the right edge
  at their full size) → minimised, a 10px strip carrying just `–` that
  restores on click.
- Messages-per-second sparkline with 10s/minute ticks and red glorp/F
  bursts; dim bands shade spans the page wasn't watching (suspended
  timers, reloads) instead of drawing them flat. It flexes to fill
  whatever header space is free (the whole bar in reduced mode),
  re-rasterises to match its box so it stays sharp through resizes,
  and persists across reloads.

### Display options

- Colour style palettes (brightness-ordered, each with a designed
  shade stop) plus a separate 9-stop shade axis (white → black, or
  system-following auto); the `◐` cycle swaps hue family alone while
  picking a chip also applies its shade.
- Typography — font picker (incl. dyslexia-friendly faces), size,
  weight, line height, graduated text shadow.
- Rows — zebra striping (highlighted rows keep their own colour), row
  separator shades, five timestamp modes (off / no seconds / seconds /
  12-hour / 12-hour + seconds), five sub-chip modes (right / compact
  `[NN]` / before badges / compact-left / hidden; a dim " -- " marks
  chatters Twitch reported no month count for, skipped on the bots).
- Page-flip columns — two, or three in landscape; a full column hands
  its overflow to the next, whose old page lingers as faded ghost rows
  that incoming messages overwrite in a dimming wave from the fold.
- Stream video overlay — draggable, resizable, loads only when
  enabled; its glyph goes green while the stream is live, red when a
  stopped player exists and the stream is not.
- Tabbed help panel (config/help · resources · authors) with its own
  width and font-size controls; resizes from its edges.
- Everything persists in `localStorage`; every option answers to
  click, shift+click (reverse) and the scroll wheel. In the popup the
  style and preset links render as live swatches — background, text
  colour and, for presets, the bundled font.
- Three **theme slots** under the copy-settings-URL button stash whole
  option bundles — click recalls a filled slot (or stores the current
  options into an empty one), ⇧click/right-click overwrites; they sync
  across open tabs and clear with `reset all settings`.

### Formatting extras

- Mention highlighting — your own login joins the keyword set when
  logged in; a block-words field does the inverse, hiding any matching
  line outright.
- GLORP/F red rows, channel-point tints, fossabot/blammobot name
  shimmer (and the urls in their posts), game-line styling, braille
  art restacking.
- Image/GIF/Giphy embeds pinned right; X/Twitter preview cards via
  fxtwitter rendered below the whole message (text skipped when a bot
  like fossabot already pasted it, video thumbs playable inline;
  profile links fall back to Bird.makeup when nitter is down).
- `[notice]` labels on event rows get a cycling rainbow wash.
- Mentions landing while the page is unfocused queue on a clickable
  `@N` chip in the header — click to jump to each, ⇧click clears; a
  `♪` toggle in config/help adds a soft ping for those lines.
- `🔗` links view filters the log to rows carrying a URL and shows
  each link only once (session-only, not saved); `✂` clean urls
  rewrites link text without the `https://`, `www.` or a trailing
  `/index.htm` while leaving the target alone.
- Find bar — `ctrl+f`, `/` or the `⌕` button floats a search over the
  rendered scrollback: bare words match text, `user:login` the
  chatter, `kind:notice|mod|gap|action|emote|mention|kw|deleted|sub`
  the row type. `enter`/`⇧enter` step between matches with a counter,
  `only` collapses non-matching rows, and `archive` searches the local
  IndexedDB store — every rendered row indexes flat fields per channel
  (30-day retention, ~50MB cap) so search reaches past scrollback's
  edge; hits that still render jump to the row.
- User hiding — a comma list of logins in config/help hides their
  rows in one of three modes: `vanish` drops them, `stub` folds them
  into a running count line, `ghost` strikes them dim like deleted
  rows; persisted across visits.
- User card — clicking a nick or @mention pins an inspector: colour,
  pronouns, first-seen, session message count, recent lines, and
  profile / @mention / hide buttons. Where one's own USERSTATE flags
  mod, broadcaster or VIP privileges the card also offers
  `timeout 10m`, `ban` and `delete msg`, each a click-twice confirm
  sent through the relay as IRC commands. `⇧`/`⌃`/`⌘`-click still
  opens the Twitch profile.
- Hover previews — external links, nicks and @mentions pop a card:
  title and description, where a shortened link really lands, a
  playable video for instagram reels (resolved through kkclip), and
  for Twitch profiles the live state, followers, chat modes and
  pronouns when the chatter set them on alejo.io. Lookups run through
  the linkpeek Cloudflare worker; a config/help option scales the card
  down to text or off, and it's skipped on touch screens.

### Keyboard & accessibility

- A hidden live region announces new lines to screen readers (history
  replays skipped); the columns are `feed` landmarks and the picker is
  a labelled `dialog`.
- With the chat bar up, `↑`/`↓` select a row (accent outline),
  `r`/`enter` replies to it, `Esc` drops the pick, and typing jumps
  into the input.
- `Esc` peels layers in order — row pick, emote picker, help panel.
- Pause-on-hover option holds the scroll while a row is hovered.
- Scrolling follows new messages only while at the bottom; scrolling
  up releases it and shows a jump-to-latest button with a count of
  rows below the fold (one per column in split mode).
- `prefers-reduced-motion` honoured on shimmers, pulses and marker
  animations.

### Persistence, sync & channels

- Scrollback — the config/help panel offers limits from 250 to 100,000
  rows (1,000 by default). Larger limits use more browser memory and
  may slow long-running tabs; at most the newest 1,000 rows (including
  gap notices) survive reloads via `localStorage`.
- Stream run history, graph samples, emote-use stats, option bundles
  and picker geometry persist too.
- Multi-tab — option changes and login/logout propagate to other open
  copies through `storage` events; sent-message echoes broadcast over
  a `BroadcastChannel` so every copy renders them at once.
- `?channel=login` points chat, stream embed and status at another
  streamer for the visit; history, graph and tab-sync keys get a
  per-channel suffix so streams don't bleed into each other, and the
  OAuth round-trip carries the channel in `state`. The resources tab's
  twitch streams row links each streamer with a `*` that switches to
  them.
- PWA — installable (manifest + pass-through service worker); an
  installed standalone window survives backgrounding better than a
  tab. On cold join, wake or reconnect the page asks the relay for
  missed lines via recent-messages.robotty.de, so the log backfills
  rather than opening empty or staying truncated.

### Help popup & resources

- Four tabs — config/help, stats (session top chatters, top emotes by
  channel usage, the rate graph's loudest bursts), resources (re Hasan,
  clips, news, yt
  channels, twitch streams, usa pol, dsa chapters, left parties,
  organising, conduct, dual power, mutual aid, free software, open
  hardware, justice, extra links), and authors (era-grouped reading
  lists) — laid out in link columns whose count is capped by the
  popup's own width via container queries.
- The popup resizes from its edges and offers widths from 480 to
  1600px.

### URL options

Query params apply a configuration on top of (and into) the saved one,
e.g. `?split&theme=dark&size=18&font=inter`. Booleans take `=0` to
force off.

| key | values | effect |
|---|---|---|
| `split` | `2` / `3` | page-flip columns (3 on landscape screens) |
| `min` | `1` / `graph` | minimised strip, or reduced header with the rate graph across the bar |
| `style` | a theme name | palette (a bare `style` lands on its designed shade stop) |
| `shade` | `0`–`8`, `auto` | shade axis; `auto` follows the system |
| `font` | a font key | chat font family |
| `size` | `7`–`32` | chat font px |
| `lh` | a line-height key | row line height |
| `wght` | `300`–`700` | font weight |
| `hfs` | px / `auto` | header font size (unset follows chat) |
| `hpfs` | px | help popup font size |
| `hpw` | `480`–`1600` | help popup width |
| `pause` | flag | hold the scroll while hovering a row |
| `scrollback` | `250`…`100000` | row cap |
| `rev` | flag | reverse flow — new messages cascade down from the top |
| `channel` | a twitch login | point the whole page at another channel |
| `zebra` | flag | zebra-striped rows |
| `lines` | `0`–`3` | row separator shades |
| `times` | `nosec` / `12h` / `12hsec` / `0` | timestamp mode |
| `shadow` | `0`–`2` | text shadow level |
| `video` | flag | stream video overlay |
| `sub` | `right`/`num-right`/`left`/`num-left`/`hidden` | sub-chip mode |
| `eonly` | `inline`/`right`/`off` | emote-only row mode |
| `help` | `off`/`panel`/`labels`/`both` | help display mode |
| `kw` | comma list | keyword highlights (green edge) |
| `bw` | comma list | block words — matching lines hidden |
| `ping` | flag | mention ping sound |
| `clean` | flag | cleaned link text |
| `self` | flag | accent edge on one's own messages |
| `peek` | `0`–`3` | link-hover cards: off / text / +image / +icons |
| `yt` | `0` | youtube link embeds off |
| `lkico` | `0` | link favicons off |
| `pn` | `0` | pronoun lookups on profile cards off |
| `anim` | `0`–`3` | nick styles: off / super slow / slow / on |
| `rbw` | `1`–`4` | @hasanabi rainbow: wave / hue cycle / pulse / flicker |
| `epnames` | `1` | picker: emote names on cells |
| `epzoom` | `sm`/`q`/`big` | picker cell size (½x / ¾x / 2x) |
| `epsort` | `az` | picker sort (default usage) |
| `epage` | `1` | picker age-rows mode |
| `epmix` | `1` | picker merged provider grid |
| `ephold` | `0` | picker reshuffle hold off |
| `eptabs` | comma list | picker sources: `7tv,bttv,ffz,twitch,emoji` |
| `epanim` | `anim`,`still` | picker animation filter |
| `epgeo` | `WxH[,L,T]` | picker box size (and float position, pinned) |
| `overlay` | flag | OBS browser-source mode: transparent page, live rows only |
| `mid` | a message id | scroll to and flash that row on load (set by timestamp clicks) |
| `hw` | comma list | hide these logins' rows |
| `hwm` | `vanish`/`stub`/`ghost` | how hidden users' rows render |

`theme` names a preset bundle of all display options (`default`,
`compact`, `print`, `cosy`, `cinema`, `phosphor`, `dyslexic`,
`midnight`, `solar`, `minimal`, `retro`, `irc`, `gohu`, `heather`); a
style name like `theme=dark` still selects just the palette, which is
also what the retired preset names `paper`, `mirc` and `console` now
resolve to. Presets never share a name with a style.

### Performance

- Incoming lines queue and flush once per animation frame.
- The log defaults to 1,000 rows, with higher optional caps up to
  100,000; background message queues and saved reload history stay
  bounded at 1,000 rows.

## vs. other Twitch chat clients

Where this sits relative to the usual suspects:

| | this page | Twitch site | Twitch embed | Chatterino | Chatty | jChat | DankChat | Chatsen |
|---|---|---|---|---|---|---|---|---|
| form factor | one web page | web chat panel | iframe/popout | desktop app | desktop app (Java) | web overlay | Android app | iOS/Android app |
| install / build | none, static file | none | none | app install | JRE | none | Play / F-Droid | app stores |
| runs on strict-CSP static hosts | ✅ (relay iframe) | n/a | embed-domain rules | n/a | n/a | partial | n/a | n/a |
| send chat (login) | ✅ implicit OAuth | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ (+whispers) | ✅ |
| replies | quoted block, jump-back | ✅ threads | collapsed thread | ✅ | ✅ | ❌ | ✅ | ✅ |
| polls / predictions / points | ❌ | ✅ | ❌ | partial | ❌ | ❌ | ✅ | partial |
| 7TV / BTTV / FFZ | ✅ animated, zero-width stacks | ❌ (extensions) | native only | ✅ | ✅ | partial | ✅ | ✅ |
| backfill after suspend/resume | ✅ (robotty) | recent only | ❌ | ✅ | ❌ | ❌ | history search | ❌ |
| msgs/sec graph, gap & burst marks | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| theming / accessibility fonts | palettes × 9-stop shade axis | light/dark | light/dark | extensive | extensive | CSS params | accent palettes | ✅ |
| multi-channel | `?channel=` per tab | per page | per embed | tabs/splits | tabs | URL param | tabs | ✅ |
| second-screen / PWA install | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| emote picker | ✅ usage stats + era marks | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| nick / emote completion | ✅ @nicks + :/tab codes | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| input draft history (↑/↓) | ✅ readline-style | ✅ | partial | ❌ | ❌ | n/a | ❌ | ❌ |
| keyword / block-word filters | ✅ kw + bw | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| mention alerts | ✅ chip + opt. ping | partial | partial | ✅ sound/toast | ✅ | partial | ✅ | ✅ |
| link / media cards | ✅ x-cards, gifs, imgs, link/emote hovers | partial | partial | ✅ hover previews | partial | ❌ | ❌ | ❌ |
| emote-only enlargement | ✅ 3 modes | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| gap notices (missed spans) | ✅ timed + cause | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| scrollback limit | ✅ 250–100k | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| draft length warn | ✅ fossa + 500 cap | ❌ | ❌ | ❌ | ❌ | n/a | ❌ | ❌ |
| usercard / mod UI | ❌ slash cmds pass through | ✅ | partial | ✅ | ✅ | ❌ | ✅ | partial |
| whispers | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| stream stats line | ✅ uptime·viewers·chatters | viewers/uptime | ❌ | partial | ✅ | ❌ | partial | partial |
| stream video alongside | ✅ drag/resize overlay | ✅ | ❌ | ❌ | partial ext. | ❌ | ❌ | ❌ |
| multi-column log | ✅ 2-3 page-flip | ❌ | ❌ | ✅ splits | partial | ❌ | ❌ | ❌ |
| screen-reader landmarks | ✅ live region + feeds | partial | partial | ❌ | ❌ | ❌ | partial | partial |
| config as shareable url | ✅ settings-as-query | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| free/libre/open source | ✅ AGPL | ❌ | ❌ | ✅ MIT | ✅ GPLv3+ | ✅ GPLv3 | ✅ MIT | ✅ AGPLv3 |

Broad strokes only — feature sets drift; Chatterino in particular is the
much deeper client if one lives at a desktop, the Twitch site carries
the platform-only surface (polls, predictions, channel points), and
DankChat/Chatsen cover the phone. The niche here is zero
install, a host that forbids sockets outright, and a page that treats
the stream's context (resources, history, rate graph) as part of chat.

## Deploy

    neocities-deploy deploy -s hasanabi.neocities.org

Using [neocities-deploy](https://github.com/kugland/neocities-deploy)
([AUR package](https://aur.archlinux.org/packages/neocities-deploy-bin)).
The relay deploys automatically via GitHub Pages on push.

## License

AGPL-3.0 — see [LICENSE](LICENSE).
