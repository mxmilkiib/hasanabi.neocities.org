# Changelog

All notable changes to the HasanAbi chat client, newest first. Dates,
not versions — the page ships continuously to Neocities.

## 2026-10-01

### Defaults & presets
- New out-of-the-box set: dark style, shade 6, Source Code Pro 17px,
  line height 1.3, weight 400, zebra, one separator shade, compact
  `[NN]` sub chips ahead of the badges, video off, 1280px help popup,
  14px header font, own-message accent edge on. A fresh page copies a
  bare URL; precedence is defaults < saved options < URL params
- Saved `sub` modes now round-trip: bundles decode by era instead of
  always running through the oldest remap, and boot-time setters no
  longer overwrite the saved bundle before it loads
- Presets no longer share names with styles: `paper` → `print` (now at
  the white shade), `mirc` → `retro`; the `console` preset, a copy of
  `cosy`, is gone. `compact` runs at 15px
- Nine shade stops with previews drawn in the real palettes; new `ice`,
  `forest` and `wine` styles fill the hue gaps
- New `steel` style: a mid-shade slate that scales text lightness away
  from the .5 midpoint and mixes line/dim harder toward text - ~22%
  more text contrast than `mid` at shade 4 (4.14:1 vs 3.39:1) with
  crisper button borders at every stop

### Channels
- `?channel=login` retargets chat, the video embed and stream status;
  history, graph and tab-sync keys are per-channel, the header link and
  title follow, and the OAuth round-trip returns to the same channel
  through `state`
- Resources tab: `channels` split into **yt channels** and **twitch
  streams**, each streamer carrying a `*` that switches the page to
  them; both rows grouped by kind, streamers ordered by followers
- Creators present on both platforms are cross-linked - yt-channel
  entries that stream get `tw`/`*` links, and twitch-stream entries
  that upload get `yt` links
- Extra links gain droitalasante.be (Medics for the People)
- New `restorative justice` row: transform harm, BATJC, Creative
  Interventions, Interrupting Criminalization, generationFIVE, INCITE!,
  The Revolution Starts at Home, Critical Resistance, Collective
  Liberation, the RJ library and Mariame Kaba's Prison Culture

### Chat & rendering
- Page-flip ghost rows rest lighter (45% -> 62% opacity) while the fade
  hugs the wave front harder - a curved ramp keeps ghosts near-invisible
  deeper into the boundary before easing up
- Reduced header keeps ?, - and stream-play buttons at their full-mode
  size; the bar grows a few px to fit them instead of shrinking them
- Emote-picker button glyph is larger, painted at 1.5x without changing
  the button box
- Links-view button uses a smaller monochrome chain glyph instead of
  the platform-coloured emoji
- Zebra striping no longer changes the shade of highlighted chat rows;
  ordinary rows keep their alternating stripe
- Tweet previews keep a space before `[video]` in both tweet text and
  video thumbnail fallback labels
- When subscriber months are not reported, chat rows show a dim " -- "
  (or [sub --]) placeholder instead of no chip; existing rows update when
  cycling modes, and the tooltip distinguishes missing data from a real [00]
- Scrollback row cap can be set from 250 to 100,000 in config/help,
  saved locally or shared with `?scrollback=`; the background queue and
  reload cache remain limited to 1,000 rows
- Tweet preview text uses the full theme text colour for better contrast
- Emote picker emoji sheet adds more faces and hand gestures, including
  expressive, puzzled and sick faces plus directional and open hands
- `[notice]` prefixes cycle through rainbow colours without changing the
  rest of the row; reduced-motion settings keep a static rainbow
- Row metrics resolve to whole pixels: the em-based line-height and
  overlap margin are rounded in `syncLh()`, so every row boundary lands
  on a device pixel and paused columns no longer wiggle fractionally on
  each trim/append
- IRC-style input history: `↑`/`↓` walk sent messages, the draft is
  stashed on the first `↑` and restored by `↓`
- Emote picker: sections per provider (7TV / BTTV / FFZ / Twitch /
  emoji), resizable from its left and top edges, rows sized so section
  titles hug their emotes, closes on `☻` or `Esc` from anywhere
- Emote picker, later the same day: every Twitch set the login can send
  (`USERSTATE` emote-sets resolved through ivr.fi; the full global set
  when logged out, replacing a hardcoded 34), this channel's sets first;
  a `recent` row of the last 24 used; source tabs (`7tv bttv ffz twitch
  emoji`, any mix, shift-click isolates, sized to fit their labels);
  a ~610-emoji sheet; emotes grouped by name-stem (peepo*,
  Feels*, monka* cluster instead of scattering alphabetically); an `Aa`
  toggle for a names
  list view; `name - source` tooltips; case-insensitive sort; animated
  FFZ in its own section
- Emote picker orders each section by usage: most-recently-used in chat
  first, with the relay folding StreamElements' per-emote chatstats into
  `emoteUse` for tie-breaks and never-seen emotes ordered by lifetime
  count; live counts and last-use times persist across reloads
- Age markers stay dim until recording has actually covered their
  era - a `10m` cell lit means ten minutes of watch time, not just
  ten minutes of unknowns; unlit ones carry a coverage tooltip; lit
  ones go bold with an accent border and full-contrast text
- In use-sorted sections dashed `2m`/`5m`/`10m`/`20m`/`30m`/`40m`/`50m`/`60m` cells mark where
  last-seen chat use ages past each threshold; emotes never seen sit
  below them all
- Bot rows no longer carry a ` -- ` sub placeholder - fossabot and
  blammobot never report a month count, so the chip doesn't render
- The picker's Twitch emote sections actually load now: the ivr.fi ask
  re-posts until the relay answers (it could drop while the iframe was
  still loading), replies for superseded asks merge instead of being
  dropped, and the relay accepts long `emote-sets` lists
- Emote picker gets a `mix` toggle that merges every lit source
  into one flat grid - the active sort and age markers run across
  the whole pool, and source tabs still filter what feeds it
- Emote picker gets an `anim`/`still` filter pair in the toolbar: the
  relay now flags each third-party emote's animation state from 7TV,
  BTTV and FFZ provider metadata (`emoteAnim`), Twitch sets use their
  `assetType`, emoji count as still; the chips toggle like the source
  tabs (shift-click isolates), persist, and filter the `recent` row.
  Animated Twitch emotes get their `/animated/` CDN variant so they
  actually move in the grid
- Timestamps gain two 12-hour modes - the ◷ cycle now runs off /
  hh:mm / hh:mm:ss / 12-hour / 12-hour with seconds, shareable as
  `?times=12h`/`?times=12hsec`
- A block-words field sits under the keyword field in config/help:
  comma-separated, any chat line matching a word is hidden outright
  (persists as `bw`, shareable as `?bw=`)
- A `♪` mention ping toggles in config/help - a soft tone when a
  keyword or @you line lands while the page isn't focused
- A `✂` clean-urls toggle in config/help rewrites link text in chat
  without the scheme, a `www.` prefix or a trailing `/`/`/index.htm`;
  the link target is untouched (persists as `clean`, `?clean` shares)
- Logged in, a plain click on a chatter's name types `@name ` at the
  input caret instead of opening their profile; modifier-clicks still
  open it
- Slash commands pass through to Twitch as it reads them (/timeout,
  /ban, /announce, /raid…); they drop a pending reply tag rather than
  carrying it, and no longer clear an armed reply
- Sent-message echoes survive reloads - local echo rows persist with
  their adoption key and re-register on restore, so a real copy arriving
  late through backfill still adopts the row in place instead of the
  message vanishing; a trailing backfill 45s after connect covers the
  relay's ingest lag on just-sent lines
- Socket outages join the away windows - a drop while the page stayed
  open now tags the eventual gap notice 'socket dropped' instead of
  leaving it unexplained
- Tweet video thumbs play inline: a click swaps the thumbnail for a
  muted-loop GIF or a controls+autoplay player (the direct mp4 URL was
  already in the relay payload); shift-click still opens x.com
- Links: bare domains wrapped in brackets or trailing punctuation still
  linkify (`(example.com),`); `hasanabi.neocities.org` shimmers like the
  bot names
- Graph: the trace's complement colour now respects the shade - held
  dark on light stops (mirc's yellow was vanishing), lifted on dark ones
- Styles: `paper` is a warmer cream (shade 1) with stronger two-layer
  grain that now also covers the header
- Presets drop the stream embed - one toggles video by hand and presets
  leave it alone; `minimal` is now mirc/lexend 16px with the graph
  header, `retro` is console/terminus 28px with shadow
- Header: the pinned `?` and `–` sit on the padding edge like the rest of
  the row (were 1px low); the bottom padding drops to 0 so the buttons
  sit on the border, and the channel block pins to the line top instead
  of centring low against it
- Header labels mode: `help` and `header` labels now anchor directly left
  of their corner buttons (`–` slides left to make room) instead of
  floating mid-header in flow order, aligned to the same 26px band as
  the button glyphs
- Chip order: left sub modes lead with `[12] [md]` ahead of the badges,
  right modes end `[md] [bits] [first] [sub]`; the restyle pass anchors
  right-edge chips after the colon so they stay on the first line of a
  long message. `[first]` is hot pink and bold, `[notice]` bold, sub
  chips stay upright on italic rows
- Emote-only and stacked emotes can no longer lift the line box at
  tight line heights
- Replies no longer echo twice: Twitch prepends the `@parent` mention to
  threaded replies itself, so the page stops adding its own (which
  doubled it) and matches echoes to their real lines with the mention
  stripped
- Replies show the whole original message as a dim, ruled quote block
  above the reply instead of a 48-character inline snippet; clicking it
  still jumps to the original, and rows saved earlier keep the old chip
- Tweet preview cards drop their text when the message already carries
  it (fossabot reposting a tweet), keeping only the media
- Being timed out as the logged-in user shows a `you were timed out`
  row and locks the input with a live countdown
- Video: box follows the stream's real aspect ratio with no letterbox
  gap, and the `▶` button is green while playing, red when stopped
- `🔗` links view filters the log to messages carrying a URL, showing
  only the first post of each link
- Twitch login button wears a monochrome glitch logo

### Header & graph
- Corner order is `–` then `?` rightmost, the minimised `–` keeping its
  place; the `–` wheel wraps full ⇄ reduced ⇄ minimised both ways
- Labels mode also names the shade, help and header buttons
- Status line rewords followers-only to `chat follow req: 24h` with the
  duration bolded
- Rate graph traces in the accent's complementary hue (`amber` and
  `console` stay monochrome); 30s ticks get a mid-weight stroke; the
  canvas fills its row so there's no dead space above or below the
  trace
- While chat is reconnecting the header names the socket's close code
- Chat bar loses its top rule, gets a darker field and a 1px focus ring;
  scrollback age shows on the jump-down chip, backlog count brighter

### Help popup
- Bot command columns (blammobot, fossabot) widen to 30em
- Authors tab gains a post-structuralists row (lacan through butler,
  monoskop-linked); a critical &amp; social theory
  row joins them (benjamin, adorno, fisher et al, marxists.org
  archives where they exist)
- Tab renamed **config/help** with titles bold in every state; the
  stream-status row carries a live copy of the status dot
- Widths run to 1600px; link-column counts are capped by the popup's
  own width (container queries), columns are wider (20em, authors
  26em, extra links 24em, organising and the free software/hardware
  rows 30em), and the authors tab is columnised with era headings on
  their own line
- New rows: **usa pol** (DSA national, commissions, ydsa, ActBlue),
  **dsa chapters** (largest chapter in every state), **left parties**
  (UK greens and Your Party plus the main European left parties and the
  EP group); blammobot and fossabot get separate bot rows with the
  longer fossabot command list
- The bot rows reuse the resource-link column layout: each command
  cluster sits in its own column block under a small bold heading
  (games/points; mod-utility/links/toys/offline/more)
- Extra links split into **organising**, **free software** and **open
  hardware** rows (FSF/FSFE, Software Freedom Conservancy, F-Droid,
  OSHWA, Open Source Ecology, right to repair and more), leaving a short
  extra links row
- Tenant-union directories, Sociocracy for All, dual power, Open
  Collective, Lindsay Ellis, Kat Blaque, hasanhub, the Satipatthana
  Sutta and more streamers added; turbulence points at the UK journal;
  the twitter link goes direct to x.com now that every nitter mirror
  is down or blocked

## 2026-09-30

### Help popup
- Split into resources · authors · config tabs, edge-draggable and
  resizable, default 960px, with its own font-size option; style and
  preset links render as live palette swatches; styles ordered by
  brightness, each with a designed shade stop; queer authors row added

### Chat
- Inline replies (`↩` on hover, reply bar, `reply-parent-msg-id`),
  `/me` sent as a CTCP ACTION, options/auth/echoes synced across open
  tabs, bare CLEARCHAT targets parsed
- Gap markers where the page wasn't watching, including discarded-tab
  reloads; tweet previews render video thumbnails
- Chatterino-style emote picker; notices count in zebra parity and the
  mod chip always shows
- Jump-to-bottom button with a backlog count, four times the scrollback
- `irc` and `heather` presets; video overlay clamps below the header

## 2026-09-29

### Style & appearance
- Split the theme control into two axes: `◐` picks the colour palette,
  a new `◑` button steps through 7 darkness stops (lightest → black),
  shareable via `?shade=0..6` or `auto` (system-following)
- Header text now follows the chat font; header font sizes run 7–20px
  and its option list is a separate help row without px suffixes
- Header button labels (`?` labels mode) scale with `--hdr-fs` — they
  were pinned at 13px
- Default chat font size is now 18px; lavender sits just before mirc in
  the similarity-ordered style cycle
- New `ember` style; every preset now specifies its own shade stop
- New `mirc` style + preset earlier in the day, and style/preset rename
  settled (palettes are "styles"; `◆` cycles named option bundles)

### Header & status line
- Header size states named: **full** (all buttons) → **reduced**
  (graph fills the bar) → **minimised** (10px strip, larger `–`)
- `?` and `–` pinned absolute at the top-right corner regardless of
  wrapping; `?` sits left of `–` in every mode; both are transform-
  centred and shrink to fit the thin reduced bar
- The `–` tooltip names the live mode (full/reduced/minimised) via a
  MutationObserver on the body class
- `⇧click` retreats through the cycle, matching every other control;
  scroll wheel on `–` cycles too
- Live status reads `live since HH:MM, up Nh Nm · N watching ·
  follow req for chat: Xh`; the mode chips span hides when the full
  line already carries it (was rendering twice)
- `HasanAbi` channel name links to the Twitch channel
- Help panel parks while the header is minimised and re-anchors on
  expand; the wrapped icon strip centres on its own line

### Message-rate graph
- Ticks anchor to wall-clock seconds and ride the trace; thicker minute
  marks, ticks drawn in `--text-dim` for contrast on light styles
- Window scales with rendered width (~3px/sample, snapped to 30s,
  capped at 30 minutes); flexes to fill the free header space and
  re-rasterises to its box so it stays sharp through resizes
- Graph sits left of `–` in full mode, fills the bar in reduced mode

### Columns & ghosting
- Ghost (stale) rows fade on a pixel-distance gradient from the
  fresh/ghost boundary — the row about to be overwritten is nearly
  invisible, resting rows sit at a milder dim; the fade creeps ahead
  of incoming text
- Ghost rows overwrite in place by height, repay height overage, and
  no longer strand mid-column or eat whole pages
- Third column deals through the second on landscape screens; split
  count persists across reloads; non-active columns pin to the bottom
- `?rev=1` reverses the chat flow: newest rows land at the top of each
  column. Scroll-follow, the jump button (which flips to `↑` and counts
  rows above the fold), page-flip columns and history all track the
  live edge either way; in reversed splits the first column stays live
  and each column's below-fold tail drains into the next

### Chat & auth
- Twitch OAuth login and message sending through the relay; sent
  messages echo locally dressed with the sender's real badges, colour
  and display name (USERSTATE/GLOBALUSERSTATE parsing), and are
  excluded from saved history so they don't duplicate on reload
- The input bar gains a `➤` send button for pointer/voice-only users
- Slow mode counts down in the input placeholder after each send and
  holds the next one until zero; mods, broadcasters and VIPs exempt
- Keyboard ops while the chat bar is up: typing a character jumps into
  the input, `↑`/`↓` step a selection through rows (accent outline),
  `r` or `enter` replies to the pick, `esc` drops it
- Screen-reader support: a hidden live region announces live lines
  (backfill replays and own echoes skipped), the columns are `feed`
  landmarks, the picker is a `dialog`, and the chat bar controls carry
  labels
- Deleted rows keep their strikethrough but stop dimming so hard
  (.45 → .8) - the strike is the signal, not the fade
- Own messages can carry an accent edge (`?self=1`); own-name mentions
  auto-highlight once logged in
- `@N` chip queues mentions/keyword hits arriving while unfocused —
  click to jump to each, ⇧click clears; it queues only *your* matches,
  not `@hasanabi` channel mentions
- Compact `[12]` sub-chip variants on both sides of the name
- Notice rows dedup so backlog replays don't re-add them

### Links & previews
- Status links (`x.com/…/status/…`) render an inline preview card —
  author, text, up to 4 photos — fetched by the relay through
  `api.fxtwitter.com`
- Profile links route nitter → bird.makeup → x.com; the dead
  netbub fallback is gone and the relay probes the tracker's pick
  before vouching for it (public nitter was down to one instance
  serving profiles only)
- Stepped boot progress bar in the empty state (`loading relay…` →
  `joining chat` → `socket connected` → first lines) with diagnostic
  text when nothing arrives — quiet chat vs blocked iframe

### Help popup
- Live repo stars + created/updated dates in the source row via the
  relay's GitHub API fetch; README.md and CHANGELOG.md linked directly
- Era markers inside the author rows; `—` separators between the link
  sections; DSA, ActBlue, indymedia (+ucimc/nl) and the turbulence
  wayback archive added; rows reordered (channels above authors,
  US-first news)
- Every option is clickable from the panel; popup width option on top,
  scales with the chat font; first row spans the full width
- Bot commands documented (`!roulette`, `!trivia`, `!scramble`,
  `!points`, `!top`) and bot message-formatting listed
- New controls: font weight, help popup width, keyword-highlight field
  (`?kw=` green edge), header font-size modes incl. follow-chat

## 2026-09-28

### PWA & resilience
- Installable as a PWA (manifest, icons, service worker, apple meta);
  on wake or reconnect the page asks the relay for missed lines via
  recent-messages.robotty.de and backfills rather than truncating
- Hidden-tab render backlog capped; backfill kept out of the rate
  graph with unobserved spans shaded
- Message-id dedup; last 250 rows, run history and graph samples
  persist in `localStorage`

### Video embed
- Optional Twitch player (`▶`, `?video`): floating draggable overlay,
  resizable from all four corners, clamps to the viewport, remembers
  volume/mute/play state across reloads

### Controls & display
- All option controls standardised to click / ⇧click-back / wheel
- Full font size range 7–20px; line heights down to 0.6–0.9 below the
  old 1.0 floor; separator shades cycle; status verbosity cycles on
  scroll over the status text
- Every option selectable from the help panel, which mirrors each
  control's glyph; fonts listed rendered in their own face
- Custom live-updating tooltip div replaces title attributes; compact
  rows keep highlights inside their line; wrapped text readable at
  sub-1 line heights

### Links
- News and channels rows join the help panel, ordered US → UK → Middle
  East; the authors row grew to a curated set tagged with works and
  birth-death years, ordered by era (anarchists, marxists, feminists,
  radicals & labour, culture, free culture — Stallman, Cunningham,
  Raymond, Lessig, Boal, Öcalan, Sitrin et al.)

## 2026-09-24

Initial import (synced from hasan.html) plus a same-day feature burst:

- Twitch chat via the GitHub Pages relay, raw IRC over `postMessage`
  (Neocities CSP forbids direct WebSockets); relay is channel-agnostic
- Chatterino parity pass: Twitch badges, cheermotes, 7TV/BTTV/FFZ
  emotes with zero-width stacking, mod/timeout/ban rows, `/me` actions
- Bot-specific formatting: fossabot roll tallies bolded, BlammoBot
  bracket tags hash-shaded, `!command` tokens italicised, `#points`
  lines in italics, upright names/timestamps on italic rows
- Stream status in the header: live/offline/idle-gold dot, uptime,
  viewers, "last went live" records, real stream end/length from the
  latest VOD; favicon recolors to match the dot
- Two-column page-flip layout, zebra striping, separator shades,
  timestamps, text shadow, font/size/line-height controls
- Help panel: clickable option values, see-also/extra-links rows, the
  repo link with AGPL note; copy-settings-URL button
- Twitter links rewritten through a live nitter host picked from
  status.d420.de
- Font picker with JetBrains Mono, Roobert, Terminus and more; URL
  params for shareable configurations
- README covering frontend + relay; AGPL-3.0 licensed; repo files kept
  off the deployed site via .neocitiesignore
