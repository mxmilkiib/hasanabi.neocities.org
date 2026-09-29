# Changelog

All notable changes to the HasanAbi chat client. Dates, not versions —
the page ships continuously to Neocities.

## 2026-09-29

### Style system
- Split the theme control into two axes: `◐` picks the colour palette,
  a new `◑` button steps through 7 darkness stops (lightest → black),
  shareable via `?shade=0..6` or `auto` (system-following)
- Header text now follows the chat font; fixed the chat input pointing
  at a font variable that never existed
- Default chat font size is now 18px
- Lavender sits just before mirc in the similarity-ordered style cycle
- New `ember` style; presets gained explicit shade stops

### Header & status line
- Header size states named: **full** (all buttons) → **reduced**
  (graph fills the bar) → **minimised** (10px strip with a larger `–`);
  `⇧click` retreats and scroll cycles them
- `?` and `–` are pinned absolute at the top-right corner whatever the
  wrap state; `?` sits left of `–` in every mode
- Wrapped button strip centres on its second line
- Live status reads `live since HH:MM, up Nh Nm · N watching · follow
  req for chat: Xh` style; `HasanAbi` title links to the channel
- Help panel parks while minimised and restores on expand; `?` no
  longer shows on the minimised strip

### Message-rate graph
- Ticks anchor to wall-clock seconds, so they ride the trace as it
  scrolls; minute marks are thicker
- Window scales with rendered width (~3px/sample, snapped to 30s,
  capped at 30 minutes) and flexes to fill free header space

### Split-column ghosting
- Stale rows fade on a pixel-distance gradient from the fresh/ghost
  boundary — nearly invisible right where the next row lands, easing
  back to a milder resting dim deeper into the old page

### Chat & auth
- Own messages get local echo dressed with the sender's badges, colour
  and display name via USERSTATE/GLOBALUSERSTATE parsing
- Own-name mentions auto-highlight once logged in; mentions/keyword
  hits arriving while unfocused queue on a clickable `@N` chip
- Compact `[12]` sub-chip variants on both sides of the name
- Stepped boot progress bar (`loading relay…` → `joining chat` →
  `socket connected` → first lines) with diagnostic text on stalls

### Help popup
- Live repo stars, creation and last-push dates in the source row,
  fetched via the relay from the GitHub API
- Era markers inside the author rows; `—` separators between link
  sections; DSA, ActBlue, indymedia (plus ucimc/nl locals) and the
  turbulence wayback archive linked
- First row spans the full popup width; popup scales with chat font

## 2026-09-28

### Controls
- Theme preset button (`◆`) cycling named option bundles; every option
  became clickable from the help panel
- Font weight control, configurable help popup width, header font-size
  modes (including follow-chat)
- Keyword-highlight field in the help panel (`?kw=`, green edge)
- New styles: amber, nord, solarized, lavender, mirc — plus matching
  presets (phosphor, dyslexic, midnight, minimal, paper, solar)
- Status verbosity and on/off toggles respond to scroll-wheel ticks

### Columns & rendering
- Third page-flip column deals through the second on landscape screens
- Ghost rows overwrite in place by height, fading instead of wiping;
  ghost-height overage repaid so faded rows keep their offsets
- Non-active columns pin to the bottom after reflow; split count
  persists across reloads
- Emote-only rows right-align with the sub chip trailing the name

### Twitch login
- OAuth login and message sending through the relay (chat bar, sent
  messages echo locally, excluded from saved history)

### Misc
- Live-updating tooltip div replacing title attributes
- Nitter links point at a working instance
- Bot-command help (`!roulette`, `!trivia`, `!scramble`, `!points`,
  `!top`) and bot message-formatting docs in the help panel
- Notice-row dedup so backlog replays don't re-add them

## 2026-09-24

Initial import (synced from hasan.html):

- Twitch chat over the GitHub Pages relay, raw IRC lines via
  `postMessage` (Neocities CSP forbids direct WebSocket connections)
- Stream metadata: live/offline dot, uptime, viewers, ROOMSTATE modes
- Twitch badges and cheermotes; Twitch, 7TV, BTTV and FFZ emotes with
  zero-width stacking and animated variants
- Two-column page-flip layout, zebra striping, row separators,
  timestamps, text shadow, font family/size/line-height controls
- PWA manifest, icons and service worker; missed-message backfill via
  recent-messages.robotty.de on visibility resume; message-id dedup
- Help popup with clickable option links and curated
  author/news/channel resources
- Shareable style URLs via query params; settings in `localStorage`
