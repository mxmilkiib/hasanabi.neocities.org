# Changelog

All notable changes to the HasanAbi chat client, newest first. Dates,
not versions — the page ships continuously to Neocities.

## 2026-10-07

### Fixes
- catch-up jumps no longer strand above the live edge: the glide held a
  scrollHeight target captured at click time while the mid-flight scroll
  events dropped the follow flag, so rows arriving during the animation
  left it scrolled up - the column now stays pinned through the glide
  (cleared on arrival, a wheel/touch, or a beat) and appended rows snap
  it to the real bottom
- the picker's frozen anim state caught stragglers: recents entries
  saved before the animated flag existed rendered unfrozen, and any
  animated url slips the flag check - the freeze now also triggers on
  urls that declare it themselves (/animated/ paths, .gif), and the
  recents band resolves a missing flag against the current sets
- the timeout/delete strike now lands on the message only - the
  timestamp, badges, sub chip and nick keep their look, and the line
  renders in muted gray rather than the font colour. The message body
  now wraps in a .msg span (gif embeds and right-pinned emote rows'
  selectors follow suit); rows restored from pre-change history dim
  but don't strike
- a lit emote cell now keeps its assigned spectral hue for as long as a
  chat row carrying it stays on screen: the hue survives the flash's end
  and grid rebuilds (the .lit path stamps --fc itself), and only
  releases when the cell is both unflashed and fully off-screen - a
  fresh use while still lit re-steps the wheel for a new colour
- age rungs wholly older than the tracking start go unprinted - they
  can never hold an emote, so the pre-history tail collapses to the
  t0 square alone instead of stacking 3h-12h markers
- age squares covering unlogged time keep their violet 'missed' mark
  across reloads: away windows persist through the spark save, the
  emote-use blob stamps a last-write time as a fallback seed when the
  spark is gone, and the t0 boundary square can read missed too (its
  'seen since' claim has holes) - the rule was skipped and its accent
  style sat later in the sheet than the missed violet
- animated twitch sub emotes (hasSlam, hasRant et al) now respect the
  anim filter and freeze as stills under the frozen state - the relay's
  channel-emote payload was dropping their assetType, so they read as
  static (relay 1f6f696)
- picker cells no longer sit stranded above the time-ago squares they
  already crossed: the last-minute order-pin was leapfrogging them back
  over the sub-minute rungs, and the use sort makes it redundant anyway
- sent-message echoes no longer duplicate across columns: the .local
  row stays live instead of being ghosted and evicted, so the real
  copy adopts it in place rather than landing again on the other side
- turning page-flip columns off no longer stalls the log - merged
  rows kept their ghost marks, which sent new appends mid-log and ate
  real rows; the marks now strip on every column re-deal, and the
  split toggle saves so a reload can't resurrect the columns

### Features
- era rungs no used emote has reached yet now print as violet 'soon'
  squares: in plain 'use' mode the never-used tail trips them, and in
  seen-only mode they flush at the list's end as the set of times
  still to happen - and all age squares round a touch more (rx 5 → 6)
- the picker's 'use' button is now two-mode: a second click cycles in a
  seen-only pass that hides emotes with no recorded use, and a third
  click cycles back - it persists as 'useseen' (saved bundle, ?epsort=)
  and marks itself with a dotted accent underline
- the emote-use flash hue step drops to 9°, so the spectral walk runs
  40 distinct colours per lap instead of 15
- middle-clicking the picker's 'use' button resets the recorded order:
  recency stamps and session counts clear, tracking restarts, and the
  grid falls back to the channel's own usage ranking (the stats tab's
  day/hour buckets keep their history)
- the ▦ zebra button is now a contrast dial instead of a toggle:
  off → faint → mild → strong → heavy, cycling on click and stepping
  on scroll; the config row lists all five, presets keep working
  (their on/off maps to mild/off), and ?zebra= takes a level number
- the picker's age ladder gains 45s, 3m and 4m rungs, so the early
  seconds and pre-5m stretch resolve finer
- rainbow @hasanabi mentions gain a near-black drop-shadow outline so
  the pale gradient stops stay legible; it rides a custom property the
  filter-animating variants (hue/pulse) re-apply in their keyframes
- the picker's `anim` chip is now tri-state: click cycles playing →
  frozen stills → hidden. frozen cells render the static frame - 7tv
  `*_static` variants and twitch `default` paths directly, first-frame
  renders via weserv for bttv/ffz-animated which ship none; dashed
  border marks the frozen leg and `epanim=animf` carries it in urls
- picker's time-ago squares now drift with the cells: a timed rebuild
  lands whenever the next emote's age crosses a rung, and the squares
  ride the same slide animation as the buttons (own-row mode keeps
  them heading their rows). unsorted emoji no longer weave squares
  through the tail of the grid; 10s and 20s rungs join the ladder
- chat-link favicons that miss both icon services now fall back to
  a generic link glyph instead of vanishing from the row
- the font menu previews each option in its own typeface, the closed
  select follows the current pick, and inter tops the list
- atkinson hyperlegible mono joins the font menu (`?font=
  atkinsonmono`), loaded from google fonts at 400/600 like the
  other monospace entries
- in the picker's age-rows mode, era squares only open a row when
  emotes actually follow them - an empty stretch of time-ago
  squares rides the tail of the newer cells' line instead of a
  row each; the ladder also gains a 30-second rung
- overlapping popups trade z-order on press: dragging or pressing
  the emote picker over the `?` panel (or vice versa) raises it to
  the front, and a press on the other takes the top back
- the `copy settings url` button flashes a full theme-accent fill on
  a successful copy, then eases back to chrome
- the scroll-off counter pill now gets two plain-arrow circle buttons
  flanking it at the quarter-width marks of its column - same theme,
  same jump-to-bottom, three landing spots in one, two and three
  column layouts alike
- emote-picker cells now hold their use colour while a chat row
  carrying the emote is still on screen: rows are watched for
  viewport intersection, the wash only fades once every copy has
  scrolled away or left the log
- the `news` row's independent & left organs now run biggest-to-
  smallest with the more radical ranked up: democracy now, zeteo,
  jacobin, intercept, novara ahead of the investigative and
  magazine tier, grassroots/anarchist and academic last
- link-preview images get a 1px light-violet border (`#c39bff`, the
  headings' purple), keeping the 4px corner radius
- the media tab's `news` row columns widen from 20em to 26em, so the
  outlet entries with yt/reddit sub-links stop wrapping as much
- copied settings urls now carry `gifsafe` (giphy safe-search) and
  `notify` (background notifications - opens a permission prompt on
  first load); the last two saved options the url format skipped
- the default preset is now atkinson 14px, link weight 400, no row
  separators, clean urls, mixed emote picker with hold off and a
  pinned 876x625 geometry - dark shade 6, zebra and labels on stay
- lemmy links ride the reddit column in the channels/streams
  table (yugopnik, chapo, hakim); rows with a real reddit link
  keep the lemmy spillover, now seated right after reddit
- the `?` popup's tab names take the light purple the section
  headings use (was accent inactive / text active; the active tab
  keeps its accent border)
- the `?` button now only toggles the popup - header button labels
  are their own flag driven by the popup's `header button labels`
  row, kept across reloads as `lbls` and carried in copied urls;
  old `help=labels`/`both` urls and saved mode bundles still land
  right (labels on, panel state preserved)
- stats filters normalise the labels: `alltime`/`day` read
  `all-time`/`today` everywhere, and every ranking now defaults to
  `today` (old saved prefs resolve to the new names)
- recovered gap bands on the rate graph are green now - violet was
  close enough to the socket-loss red to confuse, and a re-marked
  away span no longer clobbers a sample's `filled` tag
- the about paragraph's "no install" notes it is a PWA anyway,
  linked to web.dev's what-are-pwas explainer
- the about page's opening line drops its redundant "self-contained
  page" phrasing - the card tagline says it now - and "resource hub
  tool" becomes "info hub tool"
- the about/social card tagline gains "one-page" -
  `a compact, customisable, one-page Twitch chat client`
- chat-link favicons fall back to icon.horse when duckduckgo's icon
  service errors - a transient 404 used to remove the chip for good
- `unwall` (reader view, strips walls) joins the unblock row
- the config/help tab's left heading column joins the light purple -
  the legend's rowstyle swatches keep their colours
- the `disable ? button` row reads just `header button labels`
- `how the world works` tops the third column of extra links via a
  forced column break
- the stream title centers in its bar; the hide ✕ pins to the right
  edge instead of offsetting the text
- multi-pane ghost pages fade gentler: the overwrite boundary dips
  to .35 (was .03), the ramp narrows to 260px linear (was 340px with
  a front-hugging curve), and the resting shade rises to .7 - old
  text stays readable until new rows actually reach it
- the resource/author section headings shift from azure to light
  purple
- the `links` service cells in the channels/streams table merge
  into the column to their left (the deprogram/podcast spillover),
  dropping the sparse rightmost column
- the liberatory tab is now `left/libre` - `?htab=left` is the
  canonical token, old `liberatory` links still resolve
- the stats age filters now read longest → shortest
  (all-time → 1h) across chatters, links, emotes and badges
- top links gets the same age windows as the other rankings
  (`1h`/`12h`/today/week/month, all-time still the default), folded
  from new per-day/per-hour url buckets in the saved stats
- `opengov partnership` (strategy 2023-28) joins open gov
- stats gains `1h` and `12h` windows on chatters, emotes and badges,
  folded from new per-hour buckets kept beside the day ones; the
  scope picker moves down to sit directly over top chatters; a
  `storage` section ends the tab - localstorage key count + size,
  archive db row count, and the browser's origin estimate
- x/twitter status links outside chat (stats' top links, the help
  panel) get hover previews resolved through the relay's fxtwitter
  ask - author, text, date, photo/playable video - sharing chat's
  tweet cache; links inside rows still use the inline card
- a `community` row ends the media tab (lemmygrad, riseup);
  opendemocracy joins news' independent & left, cryptpad joins
  organising
- the resources tab splits in two: `media` keeps everything through
  channels/streams, `liberatory` takes usa pol down to extra links;
  `?htab=resources` still resolves to media
- kopimistsamfundet (sweden's file-sharing church) joins sharing;
  its `—` divider moves above the row so sharing + free culture sit
  inside the free/open block
- the channels/streams `links` column pins to the rightmost service
  slot instead of sorting in by frequency
- a `free culture` row below sharing - the movement, creative
  commons, cc's open-culture history piece, and lessig's permission
  culture; `gnu categories` (free vs non-free taxonomy) joins free
  software
- marxist/critical's subsections flow as one continuous column run
  (wider 30em columns, `marxism` picks up right where `pre-marxist`
  ends) instead of three unbreakable column blocks
- text selection highlights lavender (#b9a5f0, the about page's
  heading colour) with dark ink instead of the browser default blue -
  same rule on the about page
- hascord + r/Hasan_Piker join the first line of hasan & co. links,
  after tiktok - the second line starts at media tracker
- imgur links resolve the post's real title in previews - the
  linkpeek worker scrapes through google's translate proxy (imgur's
  own html/api are region-blocked and never emit og:title), with the
  v3 api, jina's reader and a plain image-thumbnail card as fallbacks
- resources/authors rows breathe more (12px section gaps, was 7)
  and the link columns start a .4em step below the section name
- a marxist/critical section above organising - wikipedia links to
  the key concepts grouped pre-marxist (dialectic, political
  economy, utopian socialism), marxism (historical + dialectical
  materialism, surplus value, alienation, base & superstructure…),
  and post-marxism & critical (frankfurt school, gramsci's
  hegemony, debord's spectacle, hardt & negri's empire…)
- a stream title strip under the header shows the live title -
  its ✕ dismisses until the title changes or the stream restarts;
  config's `stream title bar` option toggles it (default on,
  `?stitle=0` hides), and overlay mode drops it with the chrome
- `network organisation for the 21st century` moves from extra
  links into organising next to turbulence - correctly credited
  to halpin & summer with the "be a hub" tagline (the wordpress
  byline was for a different turbulence event)
- `open social` and `open gov` move up to sit directly after
  `free software`
- `open culture` grows into `open social`, grouped like the news
  subs: fediverse (activitypub.rocks, fediverse.party, mastodon,
  pixelfed, lemmy, peertube), indieweb (microformats, webmention,
  micro.blog), atmosphere (atproto, bluesky, blacksky), web
  standards (w3c, whatwg, solid), open chat (matrix, element,
  xmpp/jabber); bridgy fed and the werdmuller essay stay
- the channels/streams `live?` ping link drops to the smaller .85em
  annotation size
- the letter-spacing options self-demonstrate - each label renders
  with the tracking it applies (they used to inherit the live chat
  spacing instead)
- the popup font-size picker gains a `chat` option (match the chat
  font exactly, no step down); chat-relative picks now also light up
  the px stop they currently resolve to
- the news column splits into subsections, left-parties style:
  independent & left, palestine & middle east (haaretz moved in),
  wires, uk, us, and journals & intl (le monde diplo heads it)
- the tiktok column fills out: 22 creator tiktoks verified by bio,
  nickname or channel-linked socials (hasanabi, mpu, breaking points,
  tyt, secular talk, smn, novara, the serfs, maple takes, pod save via
  crookedmedia, chapo, left reckoning, hbm, thought slime, lindsay,
  kat blaque, boy boy, madeline pendleton, kaceytron, kneecoleslaw,
  frogan, yugopnik); duds skipped - coffeezilla's handle is an aussie
  coffee brand, leaping larry's a nick, mikefrompa's a placeholder,
  majorityreportfm died
- workers unions and tenants unions sections under left parties -
  intl/us/canada/uk groupings (iww, ue, ewoc, afl-cio, seiu, teamsters,
  uaw, unite here, cupe, unifor, tuc, unite, unison, rmt, iwgb, uvw;
  iut, tuf, latu, kc tenants, vancouver, acorn, lru, living rent,
  catu, mieterbund, rahu); atun-rsia and the wikipedia us-union list
  move across from organising
- foreign fridays joins channels/streams (yt name link, tw live
  stream + chat switch, ig, tiktok, patreon, site) - socials lifted
  from the channel's own video descriptions; tiktok becomes a new
  service column at the tail
- an about page at /about/ - a project landing page with the
  screenshot card, a one-line pitch, chat / extras / resources
  feature lists and the backend story (iframe relay + linkpeek
  worker), a cta back to the app; the ? popup's source row leads
  with a link to it
- the ? popup's font-size pick gains 'chat −2' and 'chat −3' beside
  'chat −1', each following the chat font that many ladder steps
  down; the values ride saved options and ?hpfs=
- a second ctrl+f tap hands off to the browser's own find - the
  first opens the in-page find bar, a repeat within half a second
  closes it and lets the keypress through
- the stats tab's window pickers (top chatters, top emotes, badges)
  run newest-first - today leads each row, alltime trails it
- a 'disable ? button toggling header button labels' pick pins the
  ? cycle to off ↔ panel, skipping the inline-labels modes; folds a
  showing labels mode back down, saved and exposed as ?nolbl=1
- tweet preview cards stamp the post's age after the author (a dim
  '· Nm/h/d/mo/y ago' with the full date on hover) - the relay
  forwards fxtwitter's created_timestamp
- fossabot posts no longer sprout the youtube thumbnail card under
  the message - the inline ▶ unfold glyph stays for on-demand play
- the stats tab's session cell now notes what the tally counts -
  everything rendered since the page first ran, kept across reloads
- resources gains podcast side-links mirroring the deprogram trio:
  kill james bond under philosophy tube, even more news under some
  more news, krystal kyle & friends under both secular talk and
  breaking points
- the channels/streams service columns now pin tw and yt leftmost
  (ahead of reddit/site) instead of ordering purely by frequency
- yt links fill in for the twitch-first entries that had none -
  maple takes, kneecoleslaw and comrade virgo
- extra links gains katseye's hootie frutti mv
- the podcast side-links share one column in the channels/streams
  grid - even more news, kill james bond and krystal kyle & friends
  ride deprogram's slot

### Fixes
- the `?` popup keeps its mode across reloads - saved panel and
  panel+labels states restore whole instead of demoting a notch,
  so phones recycling the page no longer drop the open popup
- the `?` popup stops forcing horizontal scroll on phones: the tab
  bar wraps to a second row below its min-width, and the stats
  session/bursts/glorps trio stacks two-up via a container query
  on the panel itself
- burst and glorp stats no longer spike on reload/backfill: rate and
  glorp counters stamp the line's own `tmi-sent-ts` second instead of
  render time, replays skip the glorp counters, and a backlog flushing
  late lands in its true slots rather than the wake second
- scoped (per-channel) burst and glorp series now tick in lockstep
  with the globals - they previously only grew on missed-second
  fills, leaving sparse samples with borrowed timestamps - and both
  restore across reloads with the rest of the graph window
- the about page's cta button trades fills with its marching dash -
  amber button, lavender dashes; and the card's underline runs a
  red-to-gray gradient (was solid amber)
- tyt's discord link swapped for the real invite - tyt.com/discord
  soft-404s through the spa shell; the invite resolves to TYT Official
- the ? button's border is 2px now - it reads as the odd one out
  anyway, may as well dress the part
- scroll anywhere (the drag-to-scroll extension) joins extra links,
  as does rodrigo nunes' network organisation for the 21st century
  (turbulence 4) and bo burnham's how the world works (yt); order is
  nazi, burnham, hootie, kala, scroll anywhere, turbulence down the
  left column
- an unblock row sits under news: archive.today, wayback, removepaywall,
  smry, txtify, archive button and bypass paywalls clean, closing on
  ublock origin - paywallbuster/12ft/freedium checked, all dead
- yt links for monthly review, mondoweiss and le monde diplomatique in
  english (found by channel-id search, not handles) plus indymedia's
  @IMCnetwork - waiting room and lpe project searched, nothing real
- tyt's forum link joins the lemmy spillover column instead of
  spawning its own - service aliases now fall through a preference
  list, so forum denied the reddit slot lands beside lemmy
- hasanabi's row gains discord.gg/hasan (the invite is "hasan", not
  "hasanabi") - verified against the discord api, guild name matches
- discord and patreon columns trade places; lemmy rides discord again,
  its spillover column (yugopnik, the one row with both) tucked
  straight after
- an ig column joins channels/streams: sixteen instagram links taken
  straight from each channel's own youtube about-tab socials (hasan's
  is hasandpiker, coffeezilla's is coffeebreak_yt, lindsay's is
  namebrandlindsay) - no guesses, ig sits behind reddit; philosophy
  tube's ig (theabigailthorn) joins later - her channel never linked
  it, so the about-tab sweep missed it; the re-audit found no other
  misses (hasanabi gaming's linked ig is an editor's, left reckoning's
  is an invite url)
- more yt links: hasanabi's own row finally gets @HasanAbi, chapo gets
  its channel, the news-row novara gets @novaramedia, and three tiktok
  clip channels (pikerbroadcasting, daily dose, afterdark) point at
  their youtube twins - every handle resolved through linkpeek first
- lemmy links now ride the reddit column (forum-adjacent) instead of
  discord's; a row that genuinely has the target service keeps the
  aliased link under its own column, so nothing layers - this also
  unlayers tyt's forum/reddit pair
- channels/streams link audit: every twitch, youtube, discord and site
  url verified live - kat blaque's yt moved to /c/KatBlaque (the
  @handle is dead) and chapo's lemmy link retargeted to
  hexbear.net/c/chapotraphouse (chapo.chat folded into hexbear)
- the news column grew a serious-mainstream tail: reuters, ap, bbc,
  channel 4 news, the guardian, financial times, the economist, new
  statesman, le monde
  diplomatique, haaretz, politico, nyt, wapo, the atlantic, the new
  yorker, foreign affairs, foreign policy, npr, pbs newshour,
  propublica and rest of world - every linked yt handle verified
- patreon links added for secular talk, the serfs, chapo, coffeezilla,
  kat blaque, luna oi, kaceytron and comrade virgo - every other
  patreon-less entry checked resolves 404 or a dead placeholder
- reddit links joined novara (both rows), hasanabi (r/Hasan_Piker),
  the young turks and kaceytron in channels/streams, plus democracy
  now, the intercept and jacobin in the news column - the rest of the
  table audited, no real sub for the remainder
- fear& (and fear& podcast) text in chat runs the pastel rainbow
  sweep - the same hashed-per-author scheme the @hasanabi mention wears
- fossabot youtube cards return except for the fear& and hasanabi
  gaming channels: the placeholder plants as usual but wears a mark,
  and drops at fill time when the video resolves to either (a cached
  answer drops at render); the inline ▶ play glyph stays either way
- youtube channel pages (@handle, /channel/, /c/, /user/) peeked as
  'no preview': the consent wall eats the plain scrape in some
  regions, so the worker resolves them through youtube's own public
  innertube client (resolve_url → browse) for title, about text and
  avatar; watch-page fetches also carry a socs cookie now
- the small-screen media query now also covers landscape phones
  (coarse pointer, up to 1080px); within it the default chat font
  rises to 16px (a picked size still wins, and the Aa ladder seeds
  its rung from the live size), header buttons grow to 32/38px, row
  taps can't arm double-tap zoom, and the help panel scrolls sideways
  when its service grid outruns the viewport

### Changed
- the ? popup's link-weight row is hidden for now; entry links
  default to regular (the ?lw= param still applies)

### Fixes
- tweet cards saved in scrollback never gained their author avatar and
  placeholders that missed their fetch stayed empty forever - restored
  rows now re-ask the relay for their status id (queued until the
  socket joins; a card keeps its old body if the refetch comes back
  empty), and fresh cards carry data-twid so the next reload can tell
  them apart
- the find bar could cover its own matches: a hit at a column's scroll
  edge couldn't centre and sat behind the fixed bar - while find is
  open the columns now inset their scrollport past the bar (and an
  open archive list), so jumped-to rows always land clear
- the @ completer never offered the broadcaster: candidates came only
  from nicks seen chatting, and the channel itself rarely chats - the
  joined channels now lead the pick before the recent-nick walk
- a sent line could end up missing from the input history's ↑ walk:
  sends that echoed into a sibling tab via the BroadcastChannel never
  entered that copy's history (the raw typed text now rides the echo so
  every open page keeps the same walk), /w sends skipped the push
  entirely, and the entry now lands right after the relay post so a
  failure dressing the local echo can't orphan it

## 2026-10-06

### Features
- stats gains a top links section: every url in a rendered PRIVMSG is
  normalised (scheme/www/case folded) and tallied, ranked by posts,
  scoped per channel and persisted in the session-stats blob; rows lead
  with the site's favicon and label by the page's og title once the
  linkpeek cache has it (the url stays on the tooltip; unpeeked links
  ask the worker and fall back to the url meanwhile; youtube links ask
  under the canonical watch key so they share chat's oembed-backed
  cache whatever form was posted; each key's original-case form is kept
  (urlOrig) since folded youtube/imgur ids are dead links - it feeds
  the peek ask, the href and the fallback label)
- stats glorps lists only the peak glorp/F moments - the loudest
  samples of the same series that paints the rate graph's red
  segments (>2/sec), ranked with their timestamps; a per-channel
  series keeps the scope picker honest (the total and per-chatter
  ranking are gone; so are their tallies)
- stats badge and top-emote lists cap at the top 40 rows with a
  'N more - show all' row that expands the full ranking (and a
  'collapse to top 40' row to fold it again); a sort, window, source
  or scope pick folds it back
- stats session cell lists the peak reported viewer count per channel
  (all-scope takes the max), persisted in the session-stats blob
- stats burst rows link their timestamp to that utc day's supa chat
  log (the deepest address its ?c/&d= urls reach; its search only
  matches message text, not times)
- the bots' evergreen promo urls (prime sub, fear&'s linktree and
  twitter) are hidden from top links - they live in the re Hasan row
  now: prime sub beside ideologie shop, tw/links off fear& pod
- share-tracking params are stripped from chat links at render - the
  href, the shown text and the stats key all carry the clean form.
  utm_*/click-ids go globally; host rules catch ig's stkn/igsh, yt's
  si, x's s/t and tt's share_* set (yt's t stays - it is a timestamp).
  tracked and bare posts of one url now dedupe and count together,
  and keys persisted before the strip re-fold on load so a link's
  old tracked tally merges into the clean one
- hovering the msg rate graph reads the sample under the cursor in
  the tooltip - msgs/s (or the band's cause on a gap), the glorp
  count on hot seconds, and the wall-clock time
- a top links row whose peeked title is just the site's own name
  labels from the link instead - a twitch clip slug embeds the
  clip's title in pascal case, so "Twitch" becomes the real name
- top chatters' sort pick becomes a time window - all-time, month,
  week and today (default), folded out of new per-login day buckets
  (nickDay, per-channel too, persisted as nd/ndp) like the badge
  windows; the msgs/new/active orders are gone
- resources gains an open social section (werdmuller's open social
  web essay, activitypub/atproto, fediverse app index + mastodon,
  pixelfed, lemmy; indieweb, bridgy fed, micro.blog) and the
  kalahavivādasutta (snp 2.8) under extra links

### Fixes
- link and emote hover previews dying on the stats tab: its ~3s live
  repaint swaps the dom under a still cursor, and the refired hover
  events could kill the card (null-target mouseout) then never re-arm
  it (still-cursor guard) - a refire landing on a link or emote while
  the card is dead now arms it again
- tweet video previews erroring with "no video with supported format
  and mime type found": video.twimg.com 403s any request carrying a
  foreign Referer, and where a browser leaks one past the srcdoc's
  no-referrer meta the player now retries through a referrerless
  fetch (the CDN answers CORS) and plays the blob

### Features
- stats badges get a merged filter row - alltime, month, week and day
  rank by use within that window (backed by new per-version day
  buckets in the session-stats blob), then vers, kind and name run
  the grouped views
- stats top chatters gets a sort picker: msgs (the count), a-z, new
  (lately first-seen) and active (lately spoke) - the last two rank
  and label by time instead of count, using a new last-seen tally
  that rides the same session-stats blob
- stats top emotes images emotes that live outside the joined
  channels' sets: tag-rendered ids (other channels' sub emotes typed
  here) get remembered and imaged from the twitch cdn, and scoped
  views fall back through the other joins' sets before giving up
- channels/streams in ? > resources lays out as a full table:
  streamer + switch/merge/drop controls, the kind, then one column
  per service so the same service name lines up across rows; kind
  and service cells take the dim .85em descriptor face
- stats top emotes gets a count-source picker: alltime ranks by the
  channel's StreamElements figures, local by this client's own tally,
  and today/week/month by per-day use buckets (evicted past 31 days) -
  the pick persists as hasan-emotesrc and honours the channel scope
- stats: the session counts (chatters, messages, distinct badges seen)
  sit one per row, and the first three sections (bursts, session,
  glorps) sit side by side in a three-column row above the ranked
  lists
- stats badges: the 'use' sort flattens versions out of their sets -
  every badge ranks by its own seen count as a flat row (icon + name ·
  version + count), no sets to open and unseen badges hide outright;
  other sorts keep the set groups
- stats tab re-renders live while it's open: the ~3s cadence rides the
  rate-graph tick so rankings, totals and burst rows track chat; opened
  badge sets, the folded group's state and the scroll spot survive
  each repaint
- stats: a glorps section under session - the running GLORP/F total
  plus a top-10 glorper ranking, scoped per channel and persisted in
  the stats blob like the other counters
- stats badges: the fold now holds only multi-version unseen promo
  sets - a one-badge set expanded to a copy of its own summary so it
  stays listed flat; sets owned by any joined channel (not just the
  primary) count as channel sets in every scope, and merged 'all'
  unions each channel's badge versions instead of dropping the
  non-primary channel's sets
- stats counters survive reloads like the history rows they tallied:
  top chatters, chatter names/colours, badge tallies and per-channel
  scopes save alongside the scrollback on pagehide and restore on
  load, so a refresh continues the session instead of zeroing it
- stats: top chatters lists 40 like top emotes, and both ranked
  sections now stack full-width so each flows across the 14em
  columns instead of squeezing chatters into a narrow grid cell
- stats badges read tighter: the sentence-length descriptions (set
  blurbs and per-version text) moved to tooltips on the set summary
  and version rows, so an opened set lists every version as icon +
  title + count; channel sets, core globals and seen sets stay
  listed while the promo tail keeps folding under 'N more sets'
- [notice] rows (gifted subs, raids, milestones) put the noticed
  user's name link a weight step above the rest - it was already at
  the .at bold and read thin inside the dim italic row
- link weight option for the ? popup's resources/authors tabs: a
  light…bold pick on its own row under popup font size sets the weight
  of each entry's own name link (first anchor per item) while the
  switch/merge/remove and descriptor links stay at the usual .at
  bold; saved as lwv, shareable as ?lw=500
- letter spacing (tracking) control: a new ⇄ header button beside the
  line-height one cycles an em ladder from -0.08em tight to +0.12em
  loose, resolved to px against the live chat size so the proportion
  holds across fonts; also in ? > config/help beside font weight,
  saved as lsv, shareable as ?ls=0.05
- settings urls can carry the ? popup's state: a new off/on toggle
  under "copy settings url" adds help= (the mode reproducing what's
  visible - panel open, labels, both or closed) and htab=
  (config/resources/authors/stats, the selected tab) to the copied
  link; a bare ?htab= with no help mode opens the panel on that tab,
  and htab still applies when the panel stays closed
- whispers get their own pane: incoming WHISPER lines render in a
  floating panel beside the log rather than being filtered out, an
  unread count badges a ✉ header chip styled like the @N mentions chip
  (click opens, ⇧click clears, esc closes), a name click there arms a
  /w reply, and /w name text sends through #jtv with a local echo.
  receiving whispers needs the login to carry whispers:read and
  user:read:whispers - the oauth url now requests them, so accounts
  logged in before this need a fresh twitch sign-in to see any
- per-user hiding, tri-state: a comma list of logins in ? > config/help
  hides their rows as vanish (display:none), stub (a "N hidden
  messages from nick" count line that keeps tally) or ghost (rows stay,
  struck dim like deleted ones); the list and mode persist in the
  options bundle and ride hw= / hwm= in settings urls
- OBS overlay mode: ?overlay strips the page to live rows on a
  transparent background - header, chat bar, video, panes and popups
  all hide - ready to drop into a browser source
- message permalinks: clicking a row's timestamp writes ?mid=<id> into
  the url, and a link opened that way scrolls to and flashes the row
- floating find-bar: ctrl+f, / or the ⌕ header button opens a search
  over the rendered scrollback - bare words match text, user:login the
  chatter, kind:notice|mod|gap|action|emote|mention|kw|deleted|sub the
  row type; enter/⇧enter step matches with a live counter, 'only'
  collapses non-matching rows like a blocklist hit, and rows arriving
  while the bar is open join the marks
- chat archive: every rendered row indexes flat fields (mid, ts,
  channel, login, kind, text) into a per-channel IndexedDB store held
  30 days and capped near 50MB (oldest ~15% trimmed over-cap). the
  find-bar's 'archive' button searches it newest-first past
  scrollback's edge, and a hit that still renders jumps to its row
- user inspector: a nick or @mention click pins a card - the chatter's
  colour and display casing, pronouns (alejo.io, cached), first-seen,
  session message count, their five most recent lines, and profile /
  @mention / hide buttons. ⇧/⌃/⌘-click still opens the twitch profile;
  the @mention button covers the @insert the plain click used to do
- mod quick actions: where own USERSTATE flags moderator, broadcaster
  or VIP, the inspector grows a timeout 10m / ban / delete msg row -
  each button arms "sure?" for 3s before the second click sends the
  /timeout /ban /delete through the relay on that row's channel
- stats tab in the ? popup: session chatter and message counts, the
  top 15 chatters in their nick colours, top 15 emotes by channel
  usage, and the rate graph's three loudest bursts
- split columns: ghost rows that survived to the page turn no longer
  vanish wholesale - the tail sweep used to delete every stale row in
  the flipping column regardless of the fold; above-fold ghosts now
  rejoin the previous page as ordinary rows
- the stats tab ends with a badge reference: every set collapsible,
  channel badges first then everyday globals; common sets carry a
  written meaning and versions show their titles
- top emotes in the stats tab now lists 40 and resolves far more names
  to images: channel sub emotes arrive unasked (the relay fetches
  subscriptionProducts via gql, so anonymous viewers get them too), the
  global set is requested when missing, and a late set landing repaints
- blammobot and fossabot no longer crowd the stats tab's top-chatters
  ranking; they still count in the session chatter/message totals
- "live?" next to channels/streams in the ? popup's resources tab
  probes every twitch link through the relay (a streamprobe message
  type, small worker pool against decapi): live channels get a green
  dot plus viewers/title on hover, offline ones grey out
- youtube links now get an inline info card like tweets do: the
  linkpeek worker's oembed/watch-page scrape (thumbnail, title,
  channel, views, published date) paints under the message instead of
  only showing on hover. lookups key on the canonical watch url so
  youtu.be/shorts/watch forms share one fetch and the existing
  day-long peek cache; the thumbnail doubles as a click-to-play
  handle (same unfold as the ▶ glyph, start time honoured), and the
  whole thing follows the youtube-embeds toggle
- presets pin the header help mode now: default keeps the button
  labels showing, every other preset runs the bare header with labels
  off - the current-preset underline counts the mode like every other
  option it sets
- chat box location: a "chat box" option under ? > chat flow docks the
  message input under the header as well as the usual bottom edge;
  with it on top the nick completions drop down instead of up, and the
  emote picker's dock, clamping and push-clearance all flip to keep it
  below the bar. persists in saved options and as ?bartop

### Fixes & polish
- the #room tags on rows in a merged multi-channel view now run the
  same pastel rainbow sweep as @hasanabi mentions, with each channel's
  palette hashed from its name instead of the flat per-channel hues -
  the motion option's wave/hue/pulse/flick variants and the nick-styles
  off switch govern them the same way
- merged channels can be dropped from the resources tab: a stream
  already in the ?channel= list shows a blue '-' where the merge '+'
  sits, linking to the list minus that channel - removing the last one
  lands on a bare reset to the default
- the resources tab's channel list now links each stream's community
  spaces too - verified discord invites (mikefrompa, majority report,
  the serfs, kaceytron, frogan, yugopnik), subreddits, the tyt forum and
  crooked's friends of the pod, lemmy for chapo and the deprogram,
  patreon/community hubs (second thought, hbomberguy, thought slime,
  lindsay ellis, some more news, left reckoning, hakim) and link hubs
  (madeline pendleton, leaping larry, novara); streams with no findable
  community space keep just their media links
- the stats tab gains a channel scope picker on multi-channel joins:
  'scope all · #a · #b' narrows chatters, emotes, bursts, badges and
  the session row to one joined channel while 'all' keeps the combined
  view - every tally now also runs per channel (message counts, badge
  sets, live emote use, and a parallel rate series for bursts), and the
  pick persists; top emote columns widen from 11em to 14em
- the stats tab's badge list folds the promo tail away: channel sets,
  the everyday globals and sets actually seen in chat stay listed
  (~30), and the rest collapse into a 'more sets' group (~380) so the
  tab fits on one screen again - the sort buttons still rank what's
  visible
- reddit links preview properly: reddit serves a bare js shell to
  non-browser fetches, so the worker's generic scrape found nothing -
  it now reads the atom feeds instead (post .rss for title, body,
  u/author, date and embedded media; a sub or user feed for the
  subtitle and recent post titles; redd.it shortlinks resolve first)
- the ? popup's "follow" font size now tracks one ladder step below the
  chat font rather than matching it - the option is labelled 'chat −1',
  and explicit px picks still override
- reply quotes can no longer leak anchor markup into the quoted body:
  replyCtx.body came from textContent, which glued the ▶ play glyph
  (and any chip/card text) onto the message tail - the linkifier then
  ate the glyph into the url and the unicode .up wrap injected its span
  inside the new anchor's attributes, so " target=... data-u=..." showed
  as text. rows now keep their raw text in a mid-keyed map (restored
  rows fall back to a walk that skips furniture), the echo's
  reply-parent-msg-body gets proper tag escaping, and the .up wrap runs
  before linkification at both sites so a unicode url can't corrupt an
  attribute again
- picking a non-panel help mode (labels or off) from inside the open ?
  popup no longer ejects it - the mode is also the panel's visibility,
  so the pick used to close the very panel being configured. the panel
  now holds open past the pick until a real close (esc, ✕, the ? cycle)
- font previews in the ? popup now all render in their own font: the
  stack's quoted family names sat inside a "-delimited style attribute,
  so the attribute died at the first quote and every quoted-family
  preview inherited the popup's sans - the names are single-quoted now.
  also fixed Gohu's dead font url (the @master jsdelivr ref 403s; both
  nerd-font faces are pinned to the v3.4.0 tag)
- a closed emote picker no longer reopens on reload: the pin used to
  restore the picker open regardless of how the page was left - the
  pin now only remembers the float position, and open/closed persists
  separately (a missing key reads as open so existing pinned setups
  are unaffected). unpicking stays exactly what it was
- the 12-hour timestamp options actually show 12-hour times now: a mode
  switch used to only toggle the seconds fragment, leaving every
  rendered stamp in the format it was created with - setTimes now
  re-stamps every row's .time from data-ts (gap ranges reflow too, with
  seconds honouring the same hide rule). the modes are renamed so both
  conventions read plainly - 24-hour / 24-hour + seconds / 12-hour /
  12-hour + seconds - and ?times= accepts 24h and 24hsec aliases
- the find-bar's word buttons (only / archive) sized to their labels
  instead of overlapping inside hdr-btn's fixed 30px cell
- theme/shade/preset switches no longer stall on big scrollbacks:
  previewSwatches read each palette by flipping :root attrs and
  flushing a full-document restyle per chip (~41 passes), so the row
  forest now sits under style containment for the pass; pushOverflow's
  column re-deal read every row's geometry right after moving it - a
  layout per row, quadratic over a column - and now scans once, then
  moves the run in one fragment; the same batching went into
  consumeGhosts, evictGhosts and repin's reply-indent re-measure, and
  applyOpts' repin calls coalesce to one pass on a microtask
- the stats tab lays out properly: the help page's 9em label grid was
  flowing its sections into one narrow column with counts wrapped onto
  their own lines
- split columns no longer pingpong the live edge every message: a
  burst landed a multi-page live block in the receiving column, whose
  below-fold tail flipped straight back next flush - the same run
  shuttling between the two columns per message. pushOverflow now caps
  a page turn at one page of live rows; the older excess stays behind
  as ghosts of the page just turned
- tweet video thumbs actually play on click now: video.twimg.com 403s
  any request carrying a foreign Referer and <video> can't set
  referrerpolicy, so the click swap produced a dead element - the thumb
  now swaps for a srcdoc iframe whose meta forces no-referrer, sized
  exactly by the relay's new width/height payload (16:9 fallback)
- tweet preview cards show the author's avatar: the relay now forwards
  fxtwitter's author.avatar_url and the card renders it round beside
  the @handle - including the media-only variant, which used to drop
  the author entirely when a bot had already pasted the tweet text
- stats tab: badge sets now count their use in chat (messages carrying
  each set, and each version inside an open set), lay out in columns,
  and sort four ways via header buttons - use (default), name, vers,
  kind - with the choice persisted. top emotes flow into columns too,
  so the 40-strong list no longer stretches past the chatter list

## 2026-10-05

### Features
- @hasanabi rainbow motion variants in the ? popup's nick-styles row:
  sweep (the existing position march), wave (a palindrome slosh back and
  forth), hue cycle (the palette spins through the colour wheel in
  place), pulse (a brightness breathe) and flicker (stepped neon jitter).
  a body class swaps the keyframes on the same clipped gradient, so the
  nick-styles rate option still stretches or kills the period; the pick
  saves with the rest of the theme and rides ?rbw= in settings urls
- @nick completion in the chat input: typing @ at a word boundary opens
  a strip of nicks seen scrolling by (freshest first, each in its own
  chat colour), further typing narrows it, tab/⇧tab walks the pick,
  enter or a click fills the name plus a trailing space. works mid-draft
  and mid-mention, ignores email-style a@b, and esc closes it without
  touching the draft or the popup stack
- instagram reel links get a playable preview: the worker asks kkclip
  (the kkscript fixer) for the reel's signed cdn mp4 - a bot ua 302s
  straight to the file - and merges it over instagram's own og: title,
  poster and caption. the peek card renders a muted, metadata-preload
  video with controls, and becomes pointer-interactive only while it
  carries one; hide pauses playback, mousedown inside no longer
  dismisses it. failsafes: kkclip down or a non-reel url just loses the
  video field, the card keeps instagram's own metadata, and a 6h ttl
  means cached signed urls are dropped long before they rot
- pronouns on the twitch hover card: a nick or @mention preview gains a
  "pronouns: she/her"-style fact line for chatters who set them on
  pronouns.alejo.io - the lookup queues when the card opens (~4/sec
  drain), caches a month (a week when unset so new sign-ups surface),
  and lands mid-hover when the card is still up. toggleable under ? >
  config/help, rides pn= in settings urls
- bttv-style emote hover card: hovering an emote in chat or a picker
  cell pops a card with the art at the provider's largest size (7tv
  4x, bttv 3x, ffz 4, twitch 3.0), the code, and which set it came
  from; emoji cells show the glyph large with its search keywords
  underneath. a cold hover waits a beat while cell-to-cell moves swap
  instantly, the text tooltip stands down for emotes, and the card
  rides peek's autoscroll guard so the chat's own scrolling doesn't
  shake it loose
### Fixes & polish
- quiet stretches no longer print a gap row on suspicion alone: every
  >90s span now defers to the backlog like caused gaps always did - a
  replayed line inside the span earns the marker (reading "lines missed
  - socket stayed open" when no outage was recorded), an empty batch
  means chat was just quiet and emits nothing; the graph still bands
  the span grey
- resources tab link audit: hasan's bluesky link removed; anna's archive
  moved to the live .li mirror; safety first pdx (domain lapsed) now
  points at its wayback capture; twelve stale domains updated to their
  current homes - abcnews.com, batjc.org, cvilledsa.com, guifi's landing
  host, home.memphisdsa.org, milwaukee.dsawi.org, mocodsa.net,
  pluralpolicy.com/open (openstates' successor), nhdsa.org,
  siliconvalleydsa.org, levernews.com and tulsadsa's canva site
- message-drop audit: USERNOTICEs with no user text (message-less subs,
  raids, gifts) end at the channel arg so the parser now passes them
  through instead of returning null; a throwing row can no longer wedge
  the flush queue - each line renders inside its own try, and a bad parse
  no longer drops the rest of a postMessage batch; notice dedup keys
  gained system-msg entropy so two text-less subs in the same ms can't
  collide; relay-side, a chat line merely containing "RECONNECT" no longer
  kills the socket (Twitch's is a bare ':tmi.twitch.tv RECONNECT' line)
  and the remaining lines in that chunk still forward
- backfill replays no longer duplicate rows after the dedup set
  overflowed: the cap evicts the oldest ids instead of wiping the set
  (a clear forgot ids still inside the replay window), and rendered
  rows' own data-mid attrs back the check, so a replay of anything
  still in scrollback is dropped even if its id aged out
- usernames inside mod and event notices wear their nick formatting:
  "SomeChatter was timed out" and sub/raid "[notice] Name …" lines
  colour the name with the chatter's real twitch colour (falling back
  to the hash palette for users who never spoke), display-name casing
  included. a colourless nick note (the clearchat target stamp) no
  longer overwrites a stored colour in the completion map either
- hover cards (link previews and the emote card) survive row churn:
  rows sliding under a parked cursor refire mouseover on whatever now
  sits beneath it, and the non-link/non-emote target was closing the
  card on every new message. a refire at the cursor's exact last
  position is a layout shift, not a move, so the dismiss and the
  card-open paths both ignore it - the card still dies the moment the
  pointer actually moves
- just-used emote flashes cycle colours: each use steps the flash's
  --fc ~24 degrees round the hue wheel (a bright hsl) instead of always
  washing accent, so simultaneous cells glow differently and the order
  of uses reads as a slow spectral walk; the fade timing and the
  mid-fade resume on rebuilds are unchanged
- emote-picker display options join the settings bundle: names, cell
  size, sort, age rows, mix, hold, source tabs and the anim filter now
  save with hasan-opts, stash into theme slots and copy into settings
  urls as epnames=1 epzoom=sm|q|big epsort=az epage=1 epmix=1 ephold=0
  eptabs=7tv,bttv epanim=anim - only off-default options enter the url,
  and bundles lacking the keys (older saves, presets) leave the picker
  alone
- the emote picker gains ½x, ¾x and 1x size chips next to 2x: 20px
  cells for a dense overview, 30px for a middle ground, and an explicit
  reset that stays lit when normal is active (names mode keeps wide
  rows but scales art and type too); clicking a lit size drops back to
  normal, and the pick persists like the other option chips - old '1'
  saves still read as 2x
- timeouts and bans ghost the offender's existing rows: they strike
  through (the same mark single-message deletes carry) rather than
  sitting indistinguishable or vanishing - covers rows in the ban's
  own batch too, and persists through history saves
- emote completion in the chat input: :word opens a narrowing list of
  loaded emote codes (with previews), and a bare 3+ letter word plus
  tab does the same, chatterino-style; tab/⇧tab cycles, enter accepts
- authors audit batch: tagline source links for makhno (struggle
  against the state), feinberg (transgender liberation) and bauman
  (liquid fear); remaining plain annotations are deliberately plain -
  movements, orgs and descriptive labels have no single source text
- input history persists across reloads: sent lines and ↓-parked
  drafts save to localStorage (100-deep ring, same as before), so ↑
  after a refresh still walks them
- the emote picker's geometry rides the settings bundle too: a dragged
  size (and floating position, when torn free) now lands in copied
  settings urls as epgeo=WxH or epgeo=WxH,L,T, in saved opts and theme
  slots; a copied position pins the picker, the same as dragging does
- emote codes dedupe across providers now: bttv and the twitch sets
  both ship <3 (and the classics overlap elsewhere), so the first
  source scanned wins and later copies drop - plus the fresh-pin no
  longer lifts recently-used emotes above the section headers in
  non-mix mode, where the use sort already floats them to their own
  section's top
- age squares in the emote picker no longer clip their left border: the
  marching-ants svg now insets 1px so the stroke's outer half lands
  inside the cell instead of clipping at the grid edge
- 'was banned'/'timed out' notice rows link the target's name to their
  twitch channel like other nick links - hover previews the channel,
  click opens it - and the login joins the @completion list
- popup resize arrows ease 1px back off the edges on the help and emote
  popups, and the stream overlay's top-edge grab glyphs get the same
  centred four-fifths run as the other popups (hit area stays full width)
- the emote picker's hold chip breathes (a soft brightness pulse) while
  the pointer is actually holding the grid still - off when the cursor
  leaves, when hold is toggled off, or never on if hold is disabled;
  reduced-motion keeps it static
- usernotice rows dedupe the nick: twitch's system-msg already leads
  with the display name ('Nick watched at…'), so the row printed it
  twice - now the leading copy is dropped and the bold name becomes an
  a.at channel link (hover preview + click-through like a mention)
- reply quotes no longer inherit the parent's tweet preview: fillRq
  cloned every rendered node into the quote band, so a .twprev
  placeholder (or a filled .twcard) rode along and the async fill then
  shoved a whole tweet card mid-quote. card nodes are skipped in the
  clone and the twprev fill drops placeholders inside .rqt
- @hasanabi pastel contrast nudge: 34-47% sat -> 38-52%, 74-85% light
  -> 68-79% - still washed, just legible against the row
- notice rows brighten: the body text sat at --text-dim (55-68% of the
  text colour) which paired with the italic read murky; it now blends
  70% toward --text, so only the [notice] label's rainbow and the
  italic separate it from plain chat
- duplicate twitch emotes in the picker: the classic emoticons (:P, <3
  and friends) ship inside more than one emote set, so each set they
  repeated in drew its own button. codes now dedupe across sets, first
  sorted set wins - the channel's own copy beats a generic one
- the just-used flash stops renewing on other emotes' uses: every resort
  re-poked still-flashing names at full brightness, so a busy chat held
  every flash near-max and renewed them all on each use. rebuilt
  buttons now carry a negative animation-delay equal to the flash's
  elapsed age - they resume mid-fade, finish on the original 3.6s
  clock, and the removal timer lands exactly as the tail completes
- @hasanabi palettes pushed further into pastel: 44-61% sat -> 34-47%,
  69-81% light -> 74-85%
- the video popup picks up a stream that starts while it's open: the
  embed sits paused/ended on the offline slate, so a real offline->live
  flip now calls play() on the idle player - already-playing embeds
  treat it as a no-op, and a player the stream went offline under gets
  nudged only on the actual transition, not every poll
- @hasanabi mention palettes went pastel: the generator's saturation
  band dropped from 62-87% to 44-61% and lightness lifted from 57-72%
  to 69-81%, so the per-author sweeps read as soft tints rather than
  candy; the notice label's own rainbow is unchanged
- the [notice] label stands upright inside its italic notice row -
  clearer as a chip than slanted text
- fossabot resub lines link their subber now: 'Nick just subbed for N
  months' kept the name as bare text, so it now wraps in an a.at
  profile anchor - accent styling, hover preview and the twitch profile
  on click, same as a name link. @-mentions were already linked and
  stay untouched
- nick styles got a rate limit and a dial: the sweeps slowed a touch at
  the base rate (shimmer 2.5s->3s, rainbow 4s->6s), and the ✦ row now
  steps off / super slow / slow / on - the slow modes stretch the same
  sweep's period via css vars (2x and 4x). the stored/URL level keeps
  its meaning (anim=1 still on), old off stays off
- new 'hold' chip on the emote picker (on by default): while the
  pointer is over the picker, automatic reshuffles - the 1.5s use
  resort and the fresh-pin expiry - defer instead of sliding cells out
  from under a cursor mid-pick; the pending rebuild lands on
  pointer-leave, and clicks on sort/filter/search still rebuild at once
- the recents strip is its own band now, not a grid section: it sits
  fixed above the scroll grid in a tinted, ruled strip of its own, so
  the user's trail stays put and readable while the provider lists
  flow beneath - clicks pick the same way, and its MRU order is safe
  from the fresh-use pin since grid order can't reach it
- the ? popup caught up with the new behaviour: link previews now
  cover nicks and @mentions (and twitch cards list live state,
  followers and chat modes), the rowstyle legend gained blue mod rows
  and red gap rows, the emote picker got its own row (recents strip,
  one-minute fresh pin, mix/names/zoom/anim filters), the names footer
  documents @ostonox/@hasanabi mention styles and the ✦ kill-switch,
  and the history row notes saved media stays paused on restore
- hover previews no longer die in busy chat: the scroll listener that
  hides the card was also catching the follow pin's own programmatic
  scroll, so every incoming row dropped an open preview. snapLive now
  stamps its scrolls and the listener ignores the 150ms after one -
  manual scrolls still hide it
- @hasanabi mention palettes are stable per author now instead of
  next-in-sequence: the rainbow seed hashes the enclosing row's nick
  (the quoted nick inside reply bands), so one chatter's mentions keep
  a signature scheme across messages and reloads while different
  authors still spread across the palette space
- new config option kills the nick style animations: 'nick styles:
  off/on' under the ✦ row toggles body.noanim, which drops the
  shimmer/rainbow animation from styled nicks, shimmering urls, @
  mentions and the notice label - the same set the reduced-motion
  rules cover. persists in the options bundle, theme slots and the
  settings url (anim=0)
- @mentions in chat text get hover previews now: they aren't anchors,
  so the hover handler synthesizes the nick's twitch.tv profile url and
  feeds it through the same peek pipeline - same cache key as hovering
  the name link itself, so the two share one entry. the client's own
  peek sanitizer also learned to forward facts/ttl, which the worker
  and relay added for twitch facts
- a red gap band on the rate graph turns violet once its lines come
  back: any replayed row landing inside a recorded outage window marks
  that window's dead samples 'filled', and the band recolors to the
  violet already used for closed/discarded page gaps - the recorded
  cause keeps riding in rateWhy, so it survives reloads and stays
  readable in saves
- mentions stay visibly heavier at every Font weight setting: b's
  relative 'bolder' resolves to 900 once --chat-w reaches 600-700,
  which most fonts render as the same 700 glyph, so mentions vanished
  into the text. .at now computes max(700, chat-w + 200) - always a
  step heavier wherever the font has the cut for it
- twitch channel hovers now say a lot more: the worker surfaces a facts
  line from ivr.fi - live viewer count and game, followers, chatters,
  join date, partner/affiliate standing, and the channel's chat modes
  (followers-only, slow, emote-only, link blocks...) - plus the nick's
  chatColor on the card's left edge and, when live, the stream title
  above the bio. live previews flag a 5-minute ttl so the card doesn't
  go stale in either the worker's or the page's cache
- the picker's recents strip now counts emotes typed or pasted into the
  box and sent, not just grid clicks: sent tokens resolve through the
  emoji set, case-folded third-party names, then twitch set codes, and a
  matched send redraws an open picker so the strip updates live. strip
  items still appear in their normal sections below
- @mentions now get their bold accent chip everywhere, not just message
  bodies - reply quotes, notice rows, tweet cards and fossa columns all
  go through linkifyEsc, which gained a mention alternative after the
  url branch so @s inside links stay links (@hasanabi/@ostonox keep
  their rainbow/shimmer in these spots too)
- in use sort, an emote seen within the last minute pins to the very
  top of the picker grid - a negative grid order puts it ahead of the
  recents strip and every section header, freshest first. the pin drops
  on a rebuild timer when the minute lapses, and re-use resets it
- the @hasanabi rainbow is generated per mention now, not fixed: each
  draws the next palette - a hue arc at a golden-angle start with its
  own spread/sat/light; full arcs march one way, partial arcs breathe
  as palindromes, both tile the 200% gradient box seamlessly. the
  palette index also feeds the phase delay so identical @hasanabi texts
  don't lockstep
- @hasanabi mentions get the notice label's rainbow sweep instead of the
  bots' shimmer (ostonox keeps it) - the shared gradient/keyframes live
  in one :is() rule, and the phase stagger now covers notice-rainbow too
- shimmering names/urls/mentions no longer pulse in lockstep - each
  element gets a negative animation-delay hashed from its text, so they
  run staggered points of the same 2.5s sweep (and a given nick or url
  always lands on the same offset)
- the reply quote's left edge no longer wanders between rows: the
  name-column anchor sweep counted any .role chip (sub/mod/bits/first)
  as part of the name cluster, so the box jumped ~40px with an aux
  cluster and, in hidden-chip mode, slid 13px off the row's left edge
  (a display:none anchor reports x=0). Only .vip/.host - the chips that
  stand in for badges - count now
- the emote picker can no longer slide over the chat input row - drags,
  resizes, restored positions and reopen spots all clamp to the chat
  bar's top edge, and the bar appearing under an open picker pushes it
  up out of the way
- a tweet video or youtube embed opened mid-session was saved into row
  history with its autoplay intact, so the next page load replayed it
  with no click - saves now strip yt iframes back to the ▶ toggle and
  drop autoplay off <video>/<audio>, which restore paused but playable
- twitch login was dead everywhere, not just phones: the reachability
  preflight used fetch(), which neocities' connect-src 'self' csp always
  blocks, so the button could only ever say "connection problem". the
  probe is now an image load (img-src is unrestricted) - any response,
  even a 404, counts as reachable
- twitter links now lead with the twitter favicon like every other
  chat link - including profile links rewritten to nitter, and nitter
  urls pasted raw (ddg has no icon for twitter.com, so x.com's serves)
- the trivia Chatting emote actually relocates now: the lift matches the
  rendered img in the message html, so bttv emotes move too - the old
  scan only read the twitch emote spec, which never lists bttv's
- chat emotes now paint above the row furniture: their negative-margin
  overhang can no longer be clipped by zebra stripes, seam separators,
  chips or the reply button
- the emote button now just closes the picker when it's pinned open,
  instead of spending one press on unpinning; the pin survives the
  close, so reopening lands the picker back at its dragged position.
  the 📌 chip still unpins and snaps it home explicitly
- the emoji section leads with the hand gestures, then runs the rest
  in the traditional group order; in merged mode they keep that order
  at the grid's tail instead of being shaken through the a-z/use sort
- blammobot trivia posts that carry the chatting emote now pin it
  against the right edge of the [ Trivia ] chip instead of wherever
  it fell in the line
- the reply quote band's 3px left margin is gone: its parity background
  reaches the row's left edge like ordinary lines. the seam separator,
  zebra shadow and channel-tag hang all re-zeroed to match
- sub chips rendered while num-left mode was active carried a baked
  6px right margin that followed them into right-aligned modes,
  holding the chip off the right edge; the mode switcher now sets or
  clears that margin so it only exists where it belongs
- the ↩ in reply quote bands moved off the gutter: it now trails the
  quoted text inside the highlight, a character's space after the last
  word, so it can never land on the quoted nick. restored rows relocate
  it to match
- gaps with a recorded cause (socket dropped, page closed) now defer
  their marker to the backfill: if the replay returns lines from inside
  the span the gap row lands ahead of them; an empty response means
  nothing was actually missed and no problem row is printed.
  recovered rows carry a subtle left bar (the highlight-row marker,
  without the tint) and a hover note.
  unexplained silences still mark the gap without fetching
- reply quote bands re-measure their name-column alignment when the
  column moves - sub-mode flips, timestamp modes and font changes used
  to leave the indent stale, sliding the quoted nick under the ↩
- the per-row reply button now centres on the message's bottom line
  (a wrapped row keeps it low instead of top-corner) and docks left of
  the right-side sub/mod chips rather than overlapping them
- youtube link previews now show the upload date (as an age) and view
  count under the title - the worker reads them from the watch page's
  embedded player json since oEmbed carries neither
- a reply's quote band no longer doubles the colon after the quoted
  nick - the parent's own colon span was being cloned into the body
- a link preview's body text now wraps into the space under the floated
  image instead of staying squeezed beside it - the line clamp moved
  from -webkit-box to a clip-path so the wrap survives
- row separators sit 1px into the seam above each row's tint, so a
  highlighted row's top edge stays clean like its bottom edge; where
  there's no seam to sit in, the tint simply paints over the line
- row separators now draw a line on the seam between a reply's quote
  line and the reply itself
- a growing message box no longer lets fresh rows slide under it - a
  following column re-snaps to the bottom when the bar's height changes
- the reply quote's violet highlight hugs the quoted nick+text - ~3
  chars on each side instead of the row's full width; under zebra the
  rest of the line keeps the alternate stripe, and the ↩ and channel
  tag sit in the gutter over the band's reach
- a `2x` chip in the emote picker doubles the cell size for a closer
  look at the art - persists, and the age markers scale with it
- the emote picker's emoji are searchable by name and keyword
  (cldr/emojibase annotations - 'heart', 'cat', 'pizza'), and each
  emoji's tooltip names it
- emote tokens resolve case-insensitively, so lower-case bot commands
  (`fishh`, `farmm`) paint their emote; a folded index maps each token
  back to its canonical name for the image, tooltip, usage stats,
  zero-width stacking and the emote-only enlargement - an exact match
  still wins, and the first registered name wins a case-collision
- reply quote bands echo the parent's rendered message - emotes,
  links and media included - cloned from the live row at three-quarter
  emote size with the band on the full row line-height; a parent that
  left the log keeps the plain-text fallback, and other inline media
  caps at big-emote height
- the chat-bar emote button's ☻ stretches 1px wider leftwards so its
  centre sits centred in the button
- the chat box's placeholder text italicises and fades out while the
  box has focus
- the rate graph grows to the header's full 26px row height, and its
  ticks, trace and glorp marks quantise to the device-pixel grid so
  strokes render crisp at any display scaling; the canvas box now pins
  to that same grid so a fractional flex width can't resample the
  bitmap, the rate label absorbs the header's slack instead, and the
  pixel ratio is re-read on every refit and per-second draw so zoom or
  monitor moves re-fit the buffer; the dead-time bands wash in the
  danger colour instead of a faint grey smudge; refits also watch the
  channel block and coalesce a frame's triggers so reload-time content
  arriving in stages can't strand a gap at the graph's right edge
- hidden tabs drain queued chat rows on relay traffic and a one-second
  timer, so merely hiding the page no longer paints dead-time bands or
  sheds backlog; delayed sampler ticks refill from rendered-row counts,
  leaving bands for socket loss or a closed page
- the `?` popup width list gains 1760px and 1920px stops, and its
  font-size row uses the same centred line directly underneath
- hovering an external link pops a preview card under the cursor:
  site name, title and description scraped by a Cloudflare worker
  and brokered through the chat relay; a shortened or redirected
  link also names where it lands; the worker reads og/twitter tags,
  schema.org JSON-LD and the page's own oEmbed endpoint, so cards can
  carry the site's favicon and theme-colour edge plus a byline and
  article age; the card follows keyboard focus,
  skips image, gif, tweet and own-domain links, and stays off on
  touch screens; hits cache for a day across reloads, misses for a
  minute, and a lookup with no answer gives up after eight seconds
- a `link previews` option in the `?` popup (off / text / text +
  image), saved with the other options and carried in the settings
  url as `peek`
- the resources organising list adds cluetrain and the opencivics
  knowledge commons; open hardware gains instructables and precious
  plastic
- the header's vertical spacing balances at 3px above and below the
  buttons (was 4/2); the corner `?`/`–` pair and their labels track
  the new top edge, and the channel block keeps a 2px nudge so its
  offset from the top edge is unchanged
- zebra striping no longer shades the reply quote band - it keeps
  its violet tint on every row, and the quote still consumes its
  stripe slot so the rows below keep the alternation
- the channel row drops the extra 1px of spacing below the header's
  top edge
- accessibility pass: every `.on` toggle now mirrors `aria-pressed`;
  the help panel and stream player are labelled dialogs; help tabs
  expose tablist/tab/tabpanel with `aria-selected`; feed rows are
  `role="article"`; the reply chip, `@N` mentions chip and option
  anchors expose `role="button"` (the mentions chip and option picks
  answer enter and space); the connection dot and rate canvas are
  labelled images; the active send-target chip marks
  `aria-current`; emote-picker buttons carry a single `aria-label`
  instead of announcing their name twice; age squares announce as
  separators; drag handles and resize grips drop out of the
  accessibility tree; the boot label announces its progress
- the send button loses its tooltip and gains a hover that previews
  the twitch-purple border it carries while logged in
- the emote picker's `use` sort gains a `▤` toggle: on, each age
  square starts a new grid row on the left with its older emotes to
  the right; the button stays dimmed and unpressable under the a-z
  sort
- tweet preview cards colour the author handle twitter blue
- row separators and highlights now paint inside each row's pitch
  slot, not its overlapping box: below 1.15 line-height rows pull in
  under negative margins and a box-edge line/tint landed inside the
  neighbour's territory - the line now sits on the seam between slots
  and tints can't bleed over it
- resolved giphy gifs pin to the right edge like image embeds, and
  the row keeps its line height; unresolved gif titles stay inline.
  gifs paint above the separator lines, sit left of a right-pinned
  sub chip (with a width cap so they don't drop below it), and the
  right cluster/pinned emotes stay above a gif reaching up from a
  lower row. gifs inside reply quotes stay in the quote's flow
- reply quote indentation anchors to the leading edge of the
  badge/role/name cluster instead of the name itself - a responder
  without badge icons no longer leaves the quoted line shallow
- row separators move from border-bottom to border-top: at line
  heights above 1.15 rows pull up under negative margins and a lower
  row's zebra/highlight background painted over the line between them;
  drawing the separator on the row that overlaps keeps it visible
- `open government` shortens to `open gov`
- the `?` popup can no longer sit past a screen edge: a new clamp caps
  its width/height to the viewport below the header (presets and
  dragged sizes grow back when the window does), pulls a dragged-off
  position back inside on show and window resize, and corner-grip
  resizes stop at the edge they face
- `live tv` reorders to us, uk, eu, west asia, asia, au/ca and
  africa, and fox news + ms now join the us cable group
  (tv-login streams); the us block also gains bloomberg, yahoo
  finance, and la locals ktla, abc7 and fox 11, with livenow fox
  parked beside fox news
- the authors tab's `all` mode no longer wraps dates in a second
  pair of brackets - entries read `(work · tagline, dates)` again
- author taglines that quote or name source material now link through
  `data-g`; a same-source tagline links in themes mode, while merged
  all mode suppresses a duplicate link to the same url
- author work qualifiers link only when they identify concrete source
  material through `data-w`; movements, doctrines, organisations and
  descriptive labels stay plain instead of pretending to be titles
- authors' names mode appends life dates - birth year, or birth-death
  where known
- the author-source audit adds full-text, archive and publisher links
  across anarchist library, marxists.org, gutenberg, wikisource,
  monoskop, archive.org and author or foundation sites
- blammobot's `[Trivia]` chip spaces its brackets - other game tags
  keep their posted spelling
- bot `!command` tokens stay intact when their list wraps - no more
  break after `!`
- the jump-to-live counter's dashed edge now marches around its border
- a url whose fragment ends in an image extension (`…#/media/
  File:x.png`) no longer embeds as a broken image - the extension
  check now tests the path only, so the wiki page links as text
- image and giphy urls keep their link text on the row as italics
  beside the floated embed instead of being swallowed by it; the
  clean-urls retoggle rewrites inside the italic wrapper
- link preview cards follow the chat font size, place the image below
  the text, and decode HTML entities left over-encoded by the source
  site (`Fear&amp;` no longer renders literally); a `text + icons`
  mode shows the site favicon without loading the big preview image
- link previews on Hacker News items come from its official firebase
  api - the site itself refuses datacentre fetches - so the card shows
  the story title, points, comment count, submitter and linked host
- preview cards widen a third to 400px, lay the image to the right of
  the text, allow a longer
  description, and answer non-html links with filename, type and size
  (`report.pdf · PDF · 2.3 MB`); the worker also throttles uncached
  lookups per ip since workers.dev can't take a waf rule
- youtube watch, shorts, live and youtu.be links gain a ▶ glyph beside
  the link; clicking it unfolds a youtube-nocookie embed under the row
  (with the link's start time), and a second click folds it back - so
  nothing loads from google until asked; toggleable via
  `youtube embeds` in the `?` popup; the hover preview still applies
- chat links can lead with the site's favicon, fetched from
  duckduckgo's icon service - `link favicons` in the `?` popup
- link previews fire on favicon'd links again - the inline icon made the
  anchor look like an image-embed link, which the preview skips
- under zebra striping, the slivers of row background around a reply's
  quote band take the opposite stripe to the reply beneath, so the quote
  reads as its own line instead of sharing the reply's shade
- the rate graph splits its outage bands by cause: red for a socket that
  dropped under an open page, violet for the page itself having been
  closed or discarded; the cause rides along in the spark save, so a
  reload keeps the distinction
- a dropped socket now shows on the status dot and favicon even while
  the stream is live - the live state used to pin them green regardless
- nitter profile links no longer carry a doubled slash that some
  instances answer with a 400 - the relay strips the tracker href's
  trailing slash and the page normalises too, so an older relay keeps
  working
- moderator-action rows (timeouts, bans, a cleared chat) shade blue;
  a `…m gap` silence notice shades red, and when no outage was
  recorded for its span the graph now bands it grey rather than
  leaving it indistinguishable from a quiet-but-live trace

## 2026-10-04

### Fixes & polish
- `live tv` drops from 30em to 18em columns (new `.live` modifier):
  the row rendered as one or two wide columns at typical popup widths;
  it now fits three to five

### Additions
- the authors tab links named works and source-derived taglines in
  every info mode: works use `data-w`, taglines use `data-g`, and
  sorting or switching modes preserves the links without duplicating
  the same source in the merged `all` annotation
- `live tv` doubles its count and splits into region subsections led
  by us: pbs, livenow fox, democracy now and free speech
  tv join the us block; arirang joins asia, channels tv and sabc
  join africa
- `conduct`'s safer spaces group fills out with good night out,
  right to be, consent academy, avp, galop and take this
- `re Hasan` gains twitch (heading the row), bluesky after twitter, a
  `vods` channel in the youtube group, and the deprogram podcast after
  fear& pod
- a `sharing` row joins resources between `mutual aid` and the
  open-hardware block, covering real-goods sharing: shareable,
  giveaway apps (freecycle, buy nothing, olio), library of things,
  repair cafés, the uk cic regulator, hacklabs directories and the
  ellen macarthur circular economy foundation
- `sharing` also gains the whole earth index, the 1968–2002 catalog
  archive whose access-to-tools slogan the row descends from
- an `open knowledge` row joins the open cluster after `open
  hardware`: wiki projects, archives and public-domain libraries, open
  access research, open data and maps, then transparency - corporate
  and campaign-finance trackers, foia tooling, leak archives and the
  icij/occrp investigations. wikileaks moves here from `extra links`
- a `wellbeing` row joins between `mutual aid` and `sharing`: helpline
  directories and crisis lines, mental health charities, affordable
  therapy, the activist trauma archive, free meditation and free
  workouts. the buddhist links consolidate into it from `extra links`,
  which empties and is retired
- an `open learning` row closes the open cluster after `open
  knowledge`: free courseware (mit ocw, openlearn, khan, freecodecamp,
  saylor, p2pu), course indexes, open textbooks and wikiversity
- a `live tv` row joins after `news`: the major free 24/7 streams
  grouped by region — al jazeera, west asian, uk, eu, us nets and
  c-span, asia-pacific, canada and nigeria
- the open cluster completes: `open access` (preprints, shadow
  libraries, unlockers, the swartz manifesto), `open science` (osf,
  zenodo, openalex, pubpeer, protocols.io + open pharma), and `open
  government` (money transparency, foia, us civic data, civic tech,
  participatory platforms) join between `open knowledge` and `open
  learning`. the research and civic groups migrate out of `open
  knowledge` to match, which gains a free media group instead
- related spheres fold into existing rows: community networks (nyc
  mesh, guifi, freifunk) and the new mesh stacks (meshtastic,
  meshcore, reticulum, yggdrasil) into `open hardware`, open
  agriculture (open source seeds, farm hack, l'atelier paysan) into
  `sharing`, and the platform co-op consortium into `dual power`
- `dsa chapters` lists sibling chapters after slashes for the
  multi-chapter states: tucson, seven more california chapters,
  boulder, tampa, bloomington + lafayette, iowa city, baton rouge,
  worcester, grand rapids, mid-missouri, central + south jersey, five
  more new york chapters, charlotte + wnc, columbus + dayton, tulsa,
  pittsburgh + delco, memphis + knoxville, houston + dallas + san
  antonio, nova + charlottesville, tacoma and milwaukee
- `left parties` leads its north america block with the us parties
  before canada, matching audience geography
- `nonviolent communication` moves from `organising` to the top of
  `conduct`, where it belongs with the facilitation resources
- the aorta, rhizome and tripod facilitation co-ops move the other
  way, `conduct` to `organising`, next to the other co-ops

### Fixes & polish
- player events attach to the twitch embed object, not the getPlayer()
  proxy - the proxy is control-only and threw `addEventListener is not
  a function` when the video first reported ready
- the service worker now caches for offline use: the page and its files
  go network-first (deploys still arrive on the next load, the cached copy
  only serves offline), and images from any origin - emotes, badges, gifs -
  go cache-first with a 600-entry cap
- `clear cache` also unregisters the service worker and drops every cache
  before reloading, as a refresh for installed PWAs that have no reload button
- key texts sit in their own sections: `organising` gains the tyranny of
  structurelessness, `justice` the combahee river collective statement,
  `dual power` state and revolution, reform or revolution, the ecology of
  freedom and öcalan's democratic confederalism, `mutual aid` the
  conquest of bread
- the authors tab links the work titles of 13 authors (engels, marx,
  kropotkin, luxemburg, lenin, trotsky, einstein, wells, wilde, benjamin,
  freeman, federici, öcalan) to a full copy of the work
- `safe gifs` (below `to block` in the help panel) caps the giphy lookup
  at PG-13; off by default, so gif posts resolve unfiltered
- `live alert` sends a system notification when a watched stream goes
  live, or a keyword or @you line lands, while the page is hidden - via
  the service worker; the page also holds a web lock so browsers are less
  eager to freeze it in the background
- a twitch login the relay never confirms gives up after 20s: the token
  is dropped, the button flashes the error colour and a notice says why
- an offline banner appears under the header while the browser reports no
  connection
- header and chat-bar controls get `aria-label`s mirrored from their titles
  (kept in step as titles change), and keyboard focus shows an accent outline
- gif lookups persist in localStorage (30 days, 300 entries) so reloads and
  repeated titles skip the api, and leave one at a time, 1.2s apart, 80 an
  hour, pausing five minutes after a giphy 429; the gif images themselves
  were already cached by the service worker
- the header timestamps and emote buttons' glyphs scale 1.75, and the
  chat box emote button's face is larger and sits lower
- native twitch gif posts resolve to the actual gif: the relay searches
  giphy for the post's title and the bracketed link swaps for the image
  (best match; unresolved titles keep the giphy search link)
- the twitch button wears a purple border while logged in, and pulses
  purple while a returned token awaits the relay's confirmation; during
  that window the chat box is locked with a `finishing twitch login…`
  placeholder instead of accepting text that would go nowhere
- the header `–` is centred in its button, the timestamps glyph is a
  size larger, and the stream button's tooltip says to use the video's
  pause button to stop the stream
- the page height follows the dynamic viewport, so the chat box is no
  longer pushed below the visible edge by mobile browser toolbars
- an uncaught error or rejected promise now raises a small notice
  naming the problem, with a `copy error` button that copies the message,
  location, stack, page url (token masked), time and user agent
- the relay's emote lists are cached per channel in localStorage for 24h
  and painted on load before the relay answers; the relay's fresh list
  always replaces them, expired entries are swept, and `clear cache`
  drops them
- saved options and presets store font size, line height and weight as
  real values (px, line-height, weight), and saved options also store the
  shade by name and help width in px, so reordering a list can't shift
  a stored setting; old index-based saves still load
- default option indices live in one `DEF` table shared by the controls
  and the copy-url diff; the `heather` preset now matches its source url
- on phones the header type caps at 15px; help, emote and video panels
  follow the dynamic viewport and are pulled back on-screen on resize
- the login button preflights id.twitch.tv before the oauth redirect,
  so a dead connection fails in-page with a danger flash instead of
  pinning the button white then losing the tab to a timeout error
- `re Hasan` tucks wikipedia after twitchtracker and parks fear& pod
  last, after ostonox
- `clips` groups its two index links up front, moving hastok hub next
  to hasanhub
- `yt channels` and `twitch streams` merge into `channels/streams`,
  ordered by content type with each entry keeping its primary link,
  secondary platform link and chat-switch star
- `news` entries gain youtube links for the outlets that run channels,
  skipping the few without one and novara, whose channel already sits
  in `channels/streams`
- `left parties` leads with north america, then south america, with
  europe moved behind them
- reply quotes now hang the ↩ in the gutter so the quoted nick lands
  exactly on the responder's name column, keeping the two nicks aligned
  even when the reply carries badges

## 2026-10-03

### Additions
- `extra links` gains mettasutta and brahmavihara links after og
  mindfulness
- Mao joins the marxists authors, heading the mid 20c group with a link
  to his marxists.org archive
- A `mutual aid` row joins resources under `dual power`, taking the
  disaster relief, big door brigade and food not bombs links down with
  it and gaining mutual aid hub, the mutual aid wiki, freedge, common
  ground relief, solidarity apothecary, kropotkin's mutual aid book on
  the anarchist library and dean spade's mutual aid page
- Urls in fossabot/blammobot posts shimmer like the bots' names do -
  their !link commands output urls, and twitter/x links count too

### Fixes & polish
- `re Hasan` pairs twitchtracker with the media tracker and moves
  wikipedia ahead of fear& pod; `justice` slides up under `conduct`,
  and the `—` spacers between re Hasan/clips, free software/open
  hardware and after extra links go; `extra links` columns widen to
  match the other sections
- Section rows in the popup get more margin between them (7px over the
  old 4px), and the config `—` separators dim to opacity .4
- The authors tab's info and sort filters share a line whenever the
  popup is wide enough, wrapping back to two centered lines when narrow,
  and 'all' folds the dates into the merged bracket after a comma rather
  than a second bracket; names-only columns widen to 20em
- Bot command lists stop splitting mid-`!command`: each command plus
  its arg/descriptor is an atomic chunk and text wraps only at the ·
  separators; both bots' columns widen to fit
- Author sub-heads (classical, founders…) get a breath of margin above
  them inside their column
- `follow chat` now literally matches the chat size - the popup was
  capped at 18px and the narrow-screen header ran at 87% of chat
- Text scrolling under the ? popup's pinned tabs greys out harder -
  the fade tail now starts at 30% panel opacity rather than clear
- The `▮▮` page-flip glyph eases its vertical stretch to 1.3x so it
  clears the button's bottom edge
- The left-positioned sub chip picks up 1px of air after the
  time/channel tag, and its compact form gets 2px more on its right
- Zebra striping's description reads `bg shading on alternating rows`;
  the font menu row drops its redundant `chat font:` label

## 2026-10-02

### Additions
- A `clips` row joins the resources tab, headed by hasanhub: the
  youtube clipplex (hasanabi productions, hasan reactions, daily dose,
  hasanabi clips), the tiktok fan accounts, the hastok hub index and
  hank pecker
- `re Hasan` gains hasan's vlog and gaming youtube channels and an
  old.reddit twin on r/Hasan_Piker
- The source line gains a github star badge in the ghbtns style at
  small size, self-hosted - the live stargazer count comes from the
  relay feed and the palette follows the shade axis, dark shades
  getting github's dark chrome; the repo date now reads `started:`
- README's client comparison table grows to 31 rows, swaps plain
  ticks for ✅/❌ and names each floss client's licence
- `yt channels` gains the young turks (`news · tw *`), between
  breaking points and secular talk
- `re Hasan` gains `fear& pod`, `wikipedia` and `twitchtracker` links
  ahead of the merch tail
- `re Hasan` gains `ideologie shop` and `ostonox` (youtube) tail links
- Emote picker header reshuffles: search, pin and ✕ hold the first row,
  the six option buttons join the source-tab line pushed right, and the
  group drops to its own line when the popup is resized thin
- Resources gains a 'dual power' block under codes of conduct: the
  dualpower.app dsa lsc strategy doc and medics for the people move in,
  joined by the bsa dual power map, cooperation jackson, mutual aid
  disaster relief, big door brigade, food not bombs, the us federation
  of worker coops and ripess
- Emote picker gains a bold ✕ close button right of the pin
- urls inside notice/system-msg text, reply quotes and fossa columns now
  linkify - they bypassed renderTextHTML so they rendered as raw text
- Theme slots: three store/recall buttons above the copy-settings-URL
  row hold whole option bundles; click recalls (stores when empty),
  shift/right-click overwrites, filled slots read as `on`, and slots
  sync across open tabs
- GitHub Pages mirror at mxmilkiib.github.io/hasanabi.neocities.org
- Emote-picker era markers carry a marching-ants dashed border (an
  animated svg stroke-dashoffset), still staggered per rung; era rungs
  now extend from 1h through 12h with `Nh` labels
- First-visit sheen: while the tip banner is up, the video, login, help
  and emote-picker buttons sweep a periodic glint until each is pressed
- Authors tab can sort by area / activity (death-or-present) / birth:
  every entry carries data-b/data-d years, era labels now render as
  bold block heads like the bot lists, and the flat sort dedupes the
  mark fisher entry that sat in two sections
- Header shows a rolling `N chatters` tally - distinct senders seen in
  the last hour, the only audience figure available once a stream ends
- Help panel is now draggable and corner-resizable like the stream
  overlay and emote picker: a dotted ⠿ strip across the top moves it,
  ◤◥◣◢ glyphs resize each corner, and position persists alongside the
  width/height in `hasan-hsize`
- Authors tab gains an `info` cycle next to `sort`: `all` shows the
  "(work · dates)" notes, `works` drops the dates, `names` drops the
  whole note; the columns narrow (30em → 24em → 15em) as the text
  shrinks
- Help tab buttons got contrastier borders and a hover fill; the row
  sits tighter to the top edge with a little air beneath
- The `restorative justice` resources block is now `justice` with
  restorative / transformative sub-groups, and a new `conduct` section
  links confcoc, contributor covenant, geek feminism, citizen coc and
  safety first pdx plus a `safer spaces` sub-group: sisters uncut's
  policy, aorta, rhizome and tripod
- Multi-channel watching: `?channel=a,b,c` (up to 6) joins several rooms
  into one merged log. The first channel stays focused (title, stream
  status, video, chat target, storage keys); each row carries a `#chan`
  chip that refocuses on click and tints accent while its room is live.
  Emote/badge sets, USERSTATE/self badges, ROOMSTATE modes, timeouts and
  slow-mode countdowns all key per channel; replies post to the row's
  own room; room-wide `/clear` only wipes that channel's rows; the
  channel-switch `*` links gain a `+` twin that merges a channel into the
  current list. The relay JOINs each channel on one socket, polls decapi
  and the emote providers per channel (global sets fetched once per
  cycle), and backfills all rooms merged by timestamp

### Fixes & polish
- Dragging the emote picker pins it, and unpinning snaps it back to
  the chat-bar anchor - the stashed position drops from the saved box
  while the size survives on its own; the pin glyph gets a
  text-presentation hint
- The links-view row icon becomes a drawn svg chain - a
  text-presentation hint couldn't beat the coloured emoji font, this
  can't
- Config rows sort with the header-control settings first; the
  chat-side settings (pause, ping, scrollback, flow, clean urls)
  follow after them
- Section `—` separators gain real margins - 9px/7px in config,
  5px/3px in resources - so sections read as blocks
- Bot command lists drop `wider` so they actually columnise - 30em
  columns never fit twice in the default-width panel
- Reset and clear-cache warn in the theme's danger hue on hover
- Picking a popup width also docks the panel top-right - the dragged
  position clears and its saved x/y drops; a dragged height stays
- Line-height ↕ and column ▮▮ header glyphs scale up to match the
  neighbours (▮▮ stretches taller than wide)
- The help popup's ✕ goes bold, matching the tab links
- Channel line nudges a pixel off the header top - a touch more air
  above the status text, a touch less below
- `usa pol` splits in two - the dsa block keeps the labelled row,
  act blue / votehub / vote-vote-vote drop to a line of their own
- Config's keyword inputs retitle `to highlight`/`to block`, and `—`
  separators section the tab: above the bot commands, around the pair
  and above the source line
- Chatbar tightens: the empty char-count stops reserving 2.5ch
  between the box and the emote button, and the emote/send buttons
  now match the one-line textarea height so their tops sit flush
  instead of floating low
- Help-popup tab row gets breathing room: the first tab and the ✕
  no longer sit flush against the sticky bar's edges
- The twitch-streams legend's * and + now render in the accent
  colour like the links they describe, each note on its own line
- Stream overlay drags need the primary button - right-click on the
  handle or a resize grip was starting a drag and capturing the pointer
- Saved size, line-height and weight indices bounds-check like the
  other indexed options - an out-of-range bundle wrote 'undefinedpx'
  into the css var
- Font size, line height and weight cycles now refresh the preset 'on'
  mark - cycle()'s own help-link marking skipped markPresets
- `heather` preset fields corrected to the url they were specced from:
  emote-only rows at normal size, 1280px help width, 18px header font -
  the three had kept the copied gohu row's values
- @hasanabi and @ostonox get the bots' shimmer: their sender nicks shine
  when they speak, and @-mentions of them in message text sparkle too
- Mid-edge resize arrows (◀ ▶ ▼) fade in on hover over the help, emote
  and video popups alongside the corner glyphs, each dragging its own
  edge with the opposite side anchored; the glyphs sit small and near
  their panel edge inside the unchanged hitbox
- Bot command reference moved above the copy-settings button in the
  help popup, the appendix daggers now use relative positioning so they
  stay with their text when the panel scrolls (absolute had anchored
  them to the fixed panel), and popup borders mute to a dimmer grey mix
- Chatters tally gains a '·' separator before the count, matching the
  status line's middot convention
- Popup borders moved to a 60% accent mix so they read as accent-tinted
  frames, distinct from the dim-mix button borders inside them
- Help panel: content scrolling under the sticky tab row now fades out
  via a panel-coloured gradient tail, and the authors tab's sections
  stop interleaving - #authSections's display:contents was losing to the
  .htabpage grid rule on specificity so the section rows were being
  dealt into the wrapper's own two columns
- Rate/chatters header text now matches the stream stats size (it was
  computing against the header font, not .channel's 1.27em); the chatters
  tally moved inside the .channel block so it shares the stats' baseline,
  persists across reloads via the spark save, and hides at zero
- Chat mode chips no longer shrink - 'follow req' can't ellipsize off
  its duration value; stream-info takes the truncation instead
- Compact sub modes (`num-left`/`num-right`) drop the brackets: `12`,
  `--` and `md` instead of `[12]`, ` -- ` and `[md]`
- `hasan-last-run` now carries the channel suffix like the history and
  spark keys, so `?channel=` pages no longer read the default channel's
  run times; settings reset clears the suffixed keys
- Keyword and block-word retags skip notice rows, so a blocked word can
  no longer hide a timeout or `/clear` notice; the retag scan is
  debounced instead of running a full-dom pass per keystroke
- Blocked (`display:none`) rows no longer corrupt fold math in the
  jump-to-live counter and page-flip overflow
- `ping` and `clean` options apply in both directions through saved
  bundles and cross-tab sync (previously they could only turn on)
- Logout clears the old account's USERSTATE badges and mod/vip slow-mode
  exemption; name-click `@name` insert waits for a validated login
- Identical rapid sends each get their own echo row for adoption;
  `?split=1` can force a single column; clean-url mode strips
  `/index.htm` even with a trailing slash; the stream-status handler no
  longer throws on a missing uptime field
- Input history arrows now honour caret position in multi-line drafts:
  ↑ walks from the first line, ↓ from the last, ⇧+arrow selects
- Reply rows consume two zebra stripes: the quoted parent line takes
  the stripe opposite the reply beneath it, so the alternation holds
  per visual line (tinted rows keep their own colour on both lines); its stripe band
  extends over the row's top padding so it meets the line above
- Reply-quote lines carry a violet tint + edge so the reprinted
  parent message reads as its own highlight, distinct from the
  red/amber/green/accent row colours
- Authors-tab sort and info rows are single centred cells now,
  matching the width row instead of the two-column label grid
- Resources justice section gains an anarchist subgroup: an
  anarchist faq 'what about crime?', ferrell's against the law,
  and the 1976 instead of prisons handbook
- Multi-channel #tags right-align on a shared edge, the column
  sized by the longest joined channel name
- Joined streams stand out in the resources list: any entry whose
  * switch targets a joined channel goes azure, yt-section *s too
- Novara media moves to the yt section (its main outlet); boy boy
  drops its duplicate twitch-stream entry - the yt channel dwarfs it
- A fresh-reload button sits beside reset-all-settings: it reruns
  the page through a new ?_= url so stale copies can't be served
- Tweet preview text now linkifies too - expanded youtu.be/etc urls
  in cards rendered raw, the last path bypassing renderTextHTML
- Joined channels get a colour each (azure/orchid/orange/yellow/
  teal/violet rotation) on their row #tags, and the empty input
  shows chat as @you -> #a #b #c with clickable channel chips that
  pick where the next message goes
- The header's msgs/sec and chatters values bold like the stream times
- Floating surfaces (help panel, emote picker, stream overlay, hover
  tooltip) use a hue-neutral --popline border: white on dark shades,
  dark on light - theme-relative mixes kept taking the text hue
- The emote-picker button sits flush against the input's right edge and
  its ☻ glyph shrinks slightly so it no longer spills over the button's
  border when pressed
- Configure tab: the highlight-keyword and block-word inputs now sit
  below the blammobot/fossabot command blocks
- Authors info cycle gains a 'themes' rung between 'all' and 'works':
  each entry shows a short tagline (slogan or theme) in place of the
  work/dates note
- Authors: 'critical & social theory' moved below 'queer'
- Help popup: the ✕ button now matches the tab height, and the scroll
  fade under the tabs is denser so covered text greys out further
- Emote-picker era rungs whose window spans an unwatched stretch (tab
  hidden, socket dropped, page closed) get a dotted purple border instead
  of the standard accent dash, flagging that the usage count may be
  understated

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
- A character counter sits beside the message box: amber past ~200
  chars (a guessed fossabot long-message cutoff - its real filter
  isn't public) and red near Twitch's 500 cap, with the box border
  tinting to match
- The message input is a growing textarea: a wrapping draft gains a
  line at a time up to five before scrolling, and ⇧enter writes a
  newline (plain enter still sends). Arrow-key history only hijacks
  `↑` on a single-line draft
- `↓` on a non-empty draft parks it as a navigable slot in the send
  history and leaves a fresh line - the readline trick of stashing a
  draft under whatever gets sent next; sending from a parked slot
  closes it rather than duplicating
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
  below them all. A solid accent square marks where recording began
  (its label counts up, e.g. `47m`, `3h`, `2d`) - nothing below it
  was ever seen, since no recorded use can predate tracking. All the
  squares' borders breathe on a slow pulse so they catch the eye
  (off under prefers-reduced-motion)
- Bot rows no longer carry a ` -- ` sub placeholder - fossabot and
  blammobot never report a month count, so the chip doesn't render
- The picker's Twitch emote sections actually load now: the ivr.fi ask
  re-posts until the relay answers (it could drop while the iframe was
  still loading), replies for superseded asks merge instead of being
  dropped, and the relay accepts long `emote-sets` lists
- The emote picker is draggable by a dotted grip strip on its top edge
  (same idiom as the stream overlay; position persists), and a `📌` pin
  keeps it floating when the chat bar hides or the page reloads.
  Esc peels layers in order - picker, then the help panel
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
