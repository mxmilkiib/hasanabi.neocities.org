# Changelog

All notable changes to the HasanAbi chat client, newest first. Dates,
not versions — the page ships continuously to Neocities.

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

### Chat & auth
- Twitch OAuth login and message sending through the relay; sent
  messages echo locally dressed with the sender's real badges, colour
  and display name (USERSTATE/GLOBALUSERSTATE parsing), and are
  excluded from saved history so they don't duplicate on reload
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
