# HasanAbi Chat Thing

![HasanAbi Chat Thing - a compact, customisable, one-page Twitch chat client](og.png)

A customisable Twitch chat page centred on the
[HasanAbi](https://www.twitch.tv/hasanabi) stream,
[Hasan Piker](https://en.wikipedia.org/wiki/Hasan_Piker)'s channel
aka the Piker Broadcasting Service (a play on [PBS](https://en.wikipedia.org/wiki/PBS)).

This alternative chat view acts as a quality-of-life and accessibility tool,
for general or second-screen use, and a hub for links related to the stream.

It runs at
<https://hasanabi.neocities.org/> on [Neocities](https://neocities.org/). See the [about page](https://hasanabi.neocities.org/about/) for more.

The chat page:

- shows timestamps, badges, replies and notices alongside messages
- catches up on messages missed while the tab was asleep or closed
- graphs how fast messages arrive
- displays Twitch emotes alongside [7TV](https://7tv.app/),
  [BetterTTV](https://betterttv.com/) and
  [FrankerFaceZ](https://www.frankerfacez.com/) emotes
- lets one send messages and replies after an optional
  [Twitch login](https://dev.twitch.tv/docs/authentication/)

The `?` popup has more than settings:

- **Media:** clips, news, YouTube channels and Twitch streams.
- **Left and libre:** political organising, free software and culture.
- **Authors:** reading lists grouped by era.

The page can follow another Twitch channel. It can also combine chat
from up to six channels:

- The first channel controls the stream video, status, chat destination
  and saved channel data.
- Each message has a channel label that one can click to focus on that
  channel.

The project has two parts: this
[frontend](https://github.com/mxmilkiib/hasanabi.neocities.org)
and a separate [chat relay](https://github.com/mxmilkiib/twitch-chat-relay)
on GitHub Pages.

## Why two parts?

Neocities uses a strict
[Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP):

    connect-src 'self' data: blob:

This stops the page from opening its own
[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
to [Twitch chat](https://dev.twitch.tv/docs/irc/).
The page can, however, load a hidden iframe from
[GitHub Pages](https://pages.github.com/). That iframe runs the chat
relay, which connects to Twitch and sends data back with
[`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

The frontend handles the interface and saved settings. The relay
handles connections to other services. The frontend tells the relay
which channels to join, so the relay can also serve other channel pages.

## The Frontend - `index.html` (this repo, on Neocities)

Everything runs client-side in one file - no build step, no framework,
no dependencies beyond CDN-hosted fonts.

### Chat log

- **Messages**
  - Each row shows a time, a linked name and any Twitch badges, such as
    moderator, VIP, subscriber or founder. Text labels can appear
    beside the badges for subscriptions, bits and first messages.
  - Hover over a subscription label to see its duration in years and
    months. An optional colour setting gradually changes the label
    from teal to the theme's accent colour as the subscription gets
    longer, up to ten years.
  - In the modes that put subscription labels on the left, badge icons
    start at the same position on each row. Moderator, bits and first
    message labels follow the icons rather than leaving an empty gap
    for people who do not have them.
- **Replies**
  - A reply shows the original message above it. Click the quote to
    jump to that message in the chat log.
- **Special messages**
  - Actions written with `/me`, bot commands starting with `!` and
    `#` tags appear in italics. Names, badges and times stay upright.
  - Subscriptions, raids, gifts, timeouts, bans and other Twitch
    notices have their own rows.
  - A channel-wide `/clear` removes the visible messages. If someone
    is timed out or banned, their messages remain visible but dimmed
    and crossed out.
  - If the logged-in user is timed out or banned, the message box
    locks and shows when chatting will be available again.
- **Names and gaps**
  - Names use each chatter's Twitch colour when available. Otherwise
    the page chooses a colour from their name. It adjusts either
    colour for readability on the current theme.
  - When the page could not watch chat, it adds a row showing the
    length and cause of the gap. This includes closed tabs, sleeping
    devices and lost connections.
- **Whispers and message links**
  - With the required Twitch login permissions, private messages
    appear in a separate window. An unread count appears on the
    envelope button, and `/w name text` sends a reply.
  - Click a message's timestamp to copy a link to it. Opening that
    link scrolls to and highlights the message.

### Emotes

- **In chat**
  - The page displays Twitch, 7TV, BetterTTV and FrankerFaceZ emotes,
    including animated ones. It also displays Twitch's animated
    cheermotes in messages with bits.
  - Some 7TV emotes sit on top of the preceding emote. Messages made
    entirely of emotes can show them larger, at the right edge or at
    their usual size.
- **Preview cards**
  - Hover over an emote in chat to see a larger image, its name and
    where it comes from. Emoji previews also show search terms.
  - The picker's preview card has a separate `tip` switch. It starts off.

### Emote picker

- **Finding an emote**
  - Open the picker with `☻` beside the message box. It groups Twitch,
    7TV, BetterTTV, FrankerFaceZ and emoji, with search and a strip of
    the 24 most recently used items.
  - Use the source buttons to show or hide providers. `mix` puts the
    enabled providers in one grid. If providers share an emote name,
    the grid shows one copy. Emoji appear last in the mixed grid.
  - Click an emote to insert it where the cursor is in the message box.
- **Ordering**
  - Sort by name or by how recently chat used each emote. Earlier
    channel use breaks ties. Use counts and last-use times survive
    reloads.
  - One can limit the usage sort to emotes seen since tracking began.
    With `mix` on, emotes used in the past minute rise to the top;
    otherwise they stay in their own provider's group.
- **Time-ago squares**
  - In usage order, a labelled square separates emotes last used more
    than a given time ago. The labels run from seconds through minutes
    to twelve hours. A square stays dim until tracking has covered
    that time span. A square crossed while this page was open turns
    gold. Long stretches without emotes use a single boundary square.
  - The `▤` button chooses whether squares sit between emotes, start
    new rows, end rows or centre those rows. The `□` button chooses
    how many appear: none, a few landmarks, whole minutes and hours,
    or all of them (the default).
- **Appearance and motion**
  - `Aa` shows emote names below or beside their images, or hides them.
    The size buttons range from `½x` to `2x`.
  - `↔` chooses how emotes move when they change position: sliding,
    rippling, snapping, fading, zooming, sharpening from a blur or
    moving instantly. Recently used emotes briefly flash in a changing
    colour.
  - `still` and `anim` filter static and animated emotes. `⏸`
    shows still frames instead of moving emotes.
- **Holding the grid**
  - `hold` delays automatic rearrangement while the pointer is over
    the emotes. It stops holding in the empty space below the last
    emote row, so a large picker can update while the pointer rests
    there.
  - `hold+` is the default. It also pauses animated emotes while
    holding. Manual searches, sorting and filters still take effect.
- **Window and settings**
  - The picker starts closed. Opening it with ☻ keeps it open across
    layouts and visits; closing it keeps it closed everywhere too.
    Drag the top handle to move it or its edges to resize it. The pin
    button keeps it open when the chat bar closes.
  - Its settings, position and size can be saved or shared with the
    other display settings. Scroll over an option button to change it;
    `Esc` closes the picker before the help popup.

### Sending & the input bar

- **Sign in and send**
  - Sign in with Twitch to enable the message box. The page does not
    contain a client secret. It keeps the chat token in the browser
    until logout.
  - Press `➤` to send, or type in the box. Typing while the box is
    closed brings the cursor into it.
  - `/me` sends an action. Other slash commands, such as `/timeout`,
    `/ban`, `/announce` and `/raid`, pass through to Twitch.
- **Reply to a message**
  - Hover over a chat row and click `↩`. A bar above the message box
    shows the message being answered in the chat's font size.
  - Press `Esc` to cancel. When one sends the reply, Twitch links it
    to the original message. Only the local preview needs to add the
    `@name` that Twitch normally supplies.
- **Drafts and sent messages**
  - The box grows as a draft wraps, up to five lines, then scrolls.
    `Enter` sends the message.
  - A counter warns near Twitch's 500-character limit. It turns
    amber earlier, around 200 characters, for
    [fossabot](https://fossabot.com/)'s possible long-message limit;
    that limit is not public.
  - Sent messages appear immediately. When the server returns the
    same message, the page replaces the local copy instead of showing
    it twice. A local copy can also survive a reload.
  - `↑` and `↓` browse the last 100 messages sent in each channel.
    The page saves both that history and a draft one was writing.
- **Insert a name or emote**
  - Click a chatter's name to open their card, then use `@mention` to
    put their name in the message box. Modifier-click opens their
    Twitch profile instead.
  - Type `@` to choose from recent chatters and joined channels.
    Type `:word`, or press Tab after a word of at least three letters,
    to choose an emote. The list shows previews and narrows as one
    types; Tab, Shift+Tab, Enter and a click select an item.
- **Channel rules**
  - The box shows a countdown when slow mode delays the next message.
    Rejected messages appear as notices.

### Header & graph

- **Stream status**
  - The dot shows whether the stream is live, idle or offline. The tab
    icon changes colour to match it. Hover to see the stream title,
    viewers and uptime, or details of the last stream when offline.
  - The header also shows chat restrictions, such as slow mode,
    follower-only, subscriber-only and emote-only mode.
- **Header size**
  - `–` cycles between the full header, a smaller header that leaves
    room for the graph, and a thin strip. Click the strip to expand it.
- **Message rate**
  - The graph shows messages per second. It marks bursts of glorp and
    [F](https://knowyourmeme.com/memes/press-f-to-pay-respects)
    messages. Dim bands mark periods when the page was not watching
    chat, such as after a reload or a sleeping tab.
  - Hover over the graph to see the time, message rate, glorp count or
    the reason for a gap. The graph adjusts to the available width
    and keeps its data across reloads.
- **Site updates**
  - If a new version arrives while the page is open, a notice offers
    two reload buttons plus the poll-frequency picks (5m-3h, never)
    for changing how often the check runs. If the page behaves
    strangely, the notice suggests resetting saved settings or
    waiting for a fix.

### Display options

- **Colours and text**
  - Choose a colour palette and a separate light-to-dark shade. The
    automatic shade follows the system theme. The colour chips show
    the shade each palette was designed with.
  - Choose a font, including fonts intended to make reading easier.
    Adjust font size, weight, line height, letter spacing and shadow.
    The help popup marks the size currently in use.
- **Chat rows**
  - Adjust alternating row colours and the lines between messages.
  - Show or hide timestamps, include or omit seconds, and choose
    twelve- or twenty-four-hour time.
  - Put subscription labels on the left, right or out of view, with
    full or compact text. If Twitch does not report a subscriber's
    month count, the label shows a dim dash. Bots do not get that
    placeholder.
- **Chat columns**
  - The layout menu has nineteen layouts, listed in menu order:
    - `1col video` keeps the framed video alone, centred in the row;
      its own edges drag their side, and any bare-floor grab pulls the
      frame wider in the dragged direction - outward grows, inward
      shrinks. Its default frame size is the largest the space fits,
      rather than the shared 720px stop.
    - `1col danmaku` is `1col video` with the bullet overlay armed -
      the centred frame alone, chat comments flying across it. It is
      the only layout carrying bullets: switching away turns them off
      and picking it turns them back on. Its help row also carries
      the bullet options - text size, lane coverage, crossing
      speed, layer opacity, pinned highlights and bot/command
      filters.
    - `1col chat` keeps one full-width chat column.
    - `1col help` drops even that - the docked help popup starts at
      two-thirds of the screen, centred between two mirrored edge grips.
    - `1col vid/chat` stacks the video in its framed floating style
      over the single chat column.
    - `1col video/help` centres a rail holding the video over the
      docked help popup - the frame keeps its own width inside the
      page, and dragging its edges trades width with the help below
      while the page's edge grips size the pair.
    - `2col chat` passes older messages to a second chat column.
    - `2col chat help` docks the help popup in the rail beside one
      chat column - no video over it; `▶` floats it like `2col chat emotes`.
    - `2col chat vid/help` puts chat beside video and the help popup.
    - `2col chat vid/emotes` keeps one chat column on the left and puts
      video above the emote picker on the right.
    - `2col chat emotes` puts chat beside the emote picker. Video starts
      off; `▶` can float it over the chat.
    - `2x2` puts the stats pane over the emote picker on the left and
      the video over the chat on the right; hiding the video gives the
      chat the full height.
    - `3col chat` runs three chat columns - a landscape screen only.
    - `3col chat help` docks the same popup rail beside two chat
      columns.
    - `3col chat vid/help` puts two chat columns beside video and the
      help popup.
    - `3col chat vid/emotes/stats` puts two chat columns beside a
      column with video, emotes and stats.
    - `3col chat vid/emotes` puts two chat columns beside video and
      emotes.
    - `3col chat emotes` puts two chat columns beside the emote picker;
      video can float above the chat.
    - `3col chat vid/emotes/help` puts two chat columns beside a rail
      with video, the emote picker and the help popup.
  - Drag the divider to change the side column's width. In layouts
    with both emotes and stats, drag their divider to divide the
    remaining height. Help keeps a 280px minimum, capped by the
    screen. When help is docked in the side column, its own move and
    resize controls are disabled; stats remains a tab inside it.
- **Video and live links**
  - Drag and resize the video when it floats. It pauses when hidden.
    In the side-column layouts it can dock, float or switch off.
  - The `live?` button in the media tab checks linked Twitch channels.
    Live channels gain a green dot and a tooltip with stream details;
    offline channels appear dimmer.
- **Help popup and saved settings**
  - The popup has tabs for help and settings, stats, media, left,
    libre and authors. Change its width and font size or drag it to
    another position when it is floating.
  - The page saves choices in the browser. Click or scroll over many
    controls to cycle through options; Shift+click cycles backwards.
  - The three theme slots save sets of display choices. Click an empty
    slot to fill it, or a filled slot to restore it. Shift+click or
    right-click replaces one. `reset all settings` clears them.

### Formatting extras

- **Highlights and alerts**
  - Highlight messages that contain chosen words or mention the
    logged-in user. A separate blocked-words list hides matches.
    Mentions and reply names use the named chatter's colour.
  - While the page is out of focus, missed mentions add to a counter
    in the header. Click it to visit them, or Shift+click to clear it.
    An optional setting plays a quiet sound for mentions.
- **Special styles and media**
  - Glorp and F bursts, channel-point messages, some bot messages and
    game lines have their own styles. Notice labels can carry a
    moving rainbow colour.
  - The page shows images, GIFs and [Giphy](https://giphy.com/) posts
    beside chat messages. X/Twitter links can show a card below the
    message with a playable video when available.
- **Links and search**
  - `🔗` shows only messages with links and removes repeated links
    from that view. `✂` shortens the displayed link text and removes
    common tracking codes from link destinations.
  - X/Twitter profile and post links open a live
    [nitter](https://github.com/zedeus/nitter) mirror instead of the
    x.com login wall. The relay verifies candidate instances through
    the linkpeek worker; the fallbacks are twiiit's per-click redirect
    and bird.makeup for profiles.
  - Open search with Ctrl+F, `/` or `⌕`. Search message text, a
    username with `user:login`, or a message kind with `kind:notice`
    and similar terms. Enter and Shift+Enter step through matches;
    `only` hides rows that do not match.
  - `archive` searches messages no longer in the visible scrollback.
    The help panel offers bounded retention (30 days, trimming when
    origin usage passes about 50 MB) or unlimited retention without
    app-imposed age or size limits. Browser storage quotas still apply.
    Matches still on screen can be opened directly; trimmed ones are
    rehydrated into the log along with their surrounding context. The
    same store backs the "load earlier chat" seam at the top of the log:
    click it or just scroll into it, and batches of older history page
    in while it stays in view (shift-click loads eight pages at once).
    A `date:YYYY-MM-DD` (optionally `HH:MM`) in the find bar jumps to
    that moment instead of searching. `?mid=` permalinks and reply-chip
    jumps also restore their target from the archive when it has left
    the rendered scrollback. Paged column layouts hide the restored
    rows but keep the seam visible - a click there folds back to one
    scrolling column and loads. Where a restore skips a stretch, a
    "skipped" marker counts the gap and fills it on click. The help
    panel's import link reads a downloaded log dump (raw IRC lines or
    `[timestamp] #chan nick: text`) into the same store - raw lines
    keep their real ids, badges, emote positions and reply links, so
    they re-render like live rows. Cards under hydrated links fetch
    lazily as they scroll into view rather than at restore time.
- **People**
  - In help, add usernames to the hide list. Choose whether their
    messages disappear, become a count line, or remain visible but
    dimmed and crossed out.
  - Click a name or @mention to open a card with the user's colour,
    pronouns when available, first-seen time, message count and recent
    messages. The card has profile, @mention, highlight and hide
    buttons. Modifier-click opens their Twitch profile directly.
  - `highlight` gives all that person's messages a soft background
    based on their name colour. It also affects new messages and
    survives reloads; message highlights for mentions and keywords
    take priority.
  - When the logged-in account has permission in the channel, the
    card also offers timeout, ban and delete actions. Those actions
    ask for a second click before sending.
- **Link previews**
  - Hover over a link, name or @mention for a card with more details.
    It can show where a shortened link leads, a video from an
    Instagram reel, an X/Twitter post or Twitch profile details such
    as live status and pronouns.
  - The help controls can limit previews to text or turn them
    off. Hover previews do not run on touch screens.

### Keyboard & accessibility

- **Screen readers**
  - New messages are announced. Chat columns and the emote picker have
    labels so one can find them with assistive technology. Restored
    history is not announced as new chat.
- **Keyboard**
  - When the message box is open, `↑` and `↓` can select a chat row.
    Press `r` or Enter to reply, or `Esc` to leave row selection.
  - `Esc` also closes the emote picker and then the help popup when
    those are open.
- **Following chat**
  - The page follows new messages while one is at the bottom. Scroll
    up to stop following; a button shows how many messages arrived
    below and jumps back to the latest ones.
  - An optional pause-on-hover setting stops the scroll while the
    pointer rests over a row.
- **Motion**
  - The page reduces shimmers, pulses and other animation when the
    device asks for reduced motion.

### Persistence, sync & channels

- **Chat history**
  - Set the visible message limit between 250 and 100,000 rows;
    5,000 is the default. Higher limits can use more browser memory.
  - The page keeps up to 1,000 of the newest rows across reloads.
    It also saves stream history, graph data, emote use, statistics and
    display choices in the browser.
- **More than one tab**
  - Display changes and login or logout carry across open copies of
    the page. Messages one sends appear in every copy without waiting
    for Twitch to send them back.
- **Other channels**
  - Choose another channel, or combine up to six. Each channel has
    separate chat history, graph and saved data. The first channel
    controls the stream and where messages are sent.
  - In the media tab, click a stream's `*` link to switch to its chat.
- **Installable page**
  - The page can be installed as a
    [web app](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps).
    It asks the relay for recent messages when it opens or reconnects,
    filling in messages missed while it was away.

### Help popup & resources

- **Help and stats**
  - **Help/⚙** explains the controls and lets one change settings.
  - **Stats** shows session totals, peak viewers, and the busiest
    chatters, badges, emotes and links. Choose a joined channel and
    compare all-time, daily or hourly ranges. The tab also shows the
    busiest stretches of chat and how much browser storage the page
    uses.
- **Links**
  - **Media** collects Hasan-related links, clips, news, YouTube
    channels, other streams and community pages.
  - **Left** collects parties and organisations, unions, tenant
    groups, activism, boycotts, mutual aid, reformism, organising and
    other political resources.
  - **Libre** collects free software, open culture and design, open
    research and government, digital rights and
    [open-source intelligence](https://en.wikipedia.org/wiki/Open-source_intelligence).
  - **Authors** lists thinkers and their work by era. A linked author
    name in the left or libre tabs jumps to their entry here; links to
    organisations, tools and ideas stay in their topic tabs.
- **Layout**
  - These six tabs use more link columns as the popup grows wider.
    Resize the popup, choose a preset width or move it when floating.
    The width choices run from 480px to 1920px.

### URL options

Add these options to the page URL to set them for this visit and save
the result. For example: `?split=3&size=18&font=inter`. For on/off
options, `=0` means off. The controls described above work without
editing a URL.

| key | values | effect |
|---|---|---|
| `split` | `1`–`16` or a short name (`2ch`, `3cveh`…) | layout, in the order listed under Chat columns above |
| `min` | `1` / `graph` | minimised strip, or reduced header with the rate graph across the bar |
| `style` | a theme name | palette (a bare `style` lands on its designed shade stop) |
| `shade` | `0`–`8`, `auto` | shade axis; `auto` follows the system |
| `font` | a font key / `rand` | chat font family - `rand` draws each message in a random face (middle-click the font button or its menu) |
| `size` | `7`–`32` | chat font px |
| `lh` | a line-height key | row line height |
| `wght` | `300`–`700` | font weight |
| `ls` | `-0.08`–`0.12` em | letter spacing (tracking) |
| `lw` | `300`–`700` | boldness of links in the help popup |
| `hfs` | px / `auto` | header font size (unset follows chat) |
| `hpfs` | `chat` / `chat-1`…`chat-20` / px | help popup font size (default `20`) - the row's absolute/relative pick swaps px stops for chat-relative rungs (chat-N follows the chat font that many ladder steps down) |
| `hpw` | `480`–`1920` | help popup width |
| `hstick` | flag | sticky position - a floating help popup resizes about its own spot (centred keeps the centre, a corner dock the corner, a dragged panel its centre) |
| `pause` | flag | hold the scroll while hovering a row |
| `scrollback` | `250`…`100000` | row cap |
| `rev` | flag | reverse flow - new messages cascade down from the top |
| `wrap` | flag | page wrap - a full page retires to a faded layer the new one writes down over, like the multi-column layouts |
| `bartop` | flag | dock the chat input under the header instead of at the bottom |
| `bauto` | `0`–`2` | chat-bar autohide: off / fade / slim |
| `mnl` | `0`–`3` | msg new line: off / body on its own line / plus a blank line below / blank line above, body inline |
| `channel` | a twitch login | point the whole page at another channel |
| `zebra` | `0`–`4` / flag | zebra stripe contrast (0=off, 1=faint, 2=mild, 3=strong, 4=heavy; a bare flag = mild) |
| `lines` | `0`–`3` | row separator shades |
| `times` | `nosec`/`24h` / `24hsec` / `12h` / `12hsec` / `0` | timestamp mode |
| `shadow` | `0`–`2` | text shadow level |
| `video` | flag / `dock` / `float` / `off` | show, hide or place the stream video in layouts that allow it |
| `dan` | flag | danmaku bullets over the video |
| `danc` | `0`–`3` | danmaku cover: top ¼ / ½ / ¾ / full frame |
| `danv` | `0`–`4` | danmaku speed: ½x / ¾x / 1x / 1½x / 2x |
| `dano` | `0`–`3` | danmaku layer opacity: 25 / 50 / 75 / 100% |
| `dans` | flag / `0` | subscriber bullets lead with the month count in the chip's gradient; on by default, `0` disables |
| `danp` | `0`–`2` | pinned bullets: off / own, @you pings and keyword hits hold top-centre / +subs and bits |
| `danf` | `0`–`3` | danmaku filters: none / bots / !commands / both |
| `dfs` | px | danmaku bullet size (default `36`) - `12`/`14`/`16`/`18`/`20`/`24`/`28`/`32`/`36`/`40`/`44`/`48`/`52`; `0` follows the chat font |
| `sub` | `right`/`num-right`/`left`/`num-left`/`hidden` | sub-chip mode |
| `subg` | flag / `0` | subscription labels sweep teal → violet → red as the month count rises (up to 84 months); on by default, `0` disables |
| `ncol` | flag / `left` / `right` | nick alignment - every chatter's name lands on one edge (the widest leading prefix in view sets the stop); `left` aligns the names' starts, `right` the ends so message text columns up after them |
| `eonly` | `inline`/`right`/`off` | emote-only row mode |
| `help` | `off`/`panel` | help popup visibility (old `labels`/`both` urls still set the labels flag) |
| `lbls` | flag | header button labels shown beside each header control - independent of the `?` cycle |
| `htab` | `help`/`media`/`dsa`/`vote`/`left`/`libre`/`authors`/`stats` | selected `?` popup tab; alone it also opens the panel (`config`, `resources`, `midterms` and `liberatory` still resolve to `help`/`media`/`vote`/`libre`) |
| `kw` | comma list | keyword highlights (green edge) |
| `bw` | comma list | block words - matching lines hidden |
| `ping` | flag | mention ping sound |
| `clean` | flag | cleaned link text |
| `gifsafe` | flag | giphy pg-13 safe-search |
| `notify` | flag | background notifications (asks permission on first load) |
| `self` | flag | accent edge on one's own messages |
| `peek` | `0`–`3` | link-hover cards: off / text / +image / +icons |
| `yt` | `0` | youtube link embeds off |
| `lkico` | `0` | link favicons off |
| `pn` | `0` | pronoun lookups on profile cards off |
| `cmodes` | `0` | active chat-mode display off (chips and status-line mode text) |
| `sview` | `0`–`7` | stream-status text length by name: full / stats (full minus the chat-modes tail) / notally / compact / short (`@HasanAbi ● 3h 27m`) / minimal (`● 2h 35m 25.1k`) / blank (empty status space) / dot (just the status light) - or numeric ids `sview=0`–`7` |
| `upd` | `5`,`15`,`30`,`60`,`180`,`360`,`1440`,`0` | update-check poll minutes, default `60` (`0` = never; also the bar's update-check chips) |
| `anim` | `0`–`3` | nick shimmer: off / super slow / slow / on |
| `rbw` | `0`–`3` | rainbow motion: sweep / wave / hue cycle / random |
| `rbp` | `0`–`4` | rainbow palette: classic / vivid / candy / ocean / sunset |
| `rbws` | `0`–`3` | rainbow scope: all marks / @hasanabi only / all but @hasanabi / off |
| `epnames` | `0`–`2` | picker emote names: off / below the art / beside it |
| `epzoom` | `sm`/`q`/`th`/`hf`/`tw`/`big` | picker cell size (½x / ¾x / 1⅓x / 1½x / 1⅔x / 2x) |
| `epsort` | `az`/`useseen` | picker sort (default usage; `useseen` = usage order, hiding never-used emotes) |
| `epage` | `0`–`3` | how time-ago squares divide or centre the rows |
| `epsq` | `0`–`3` | how many time-ago squares appear: none / few / minutes and hours / all (default) |
| `epmix` | `1` | picker merged provider grid |
| `ephold` | `0`–`2` | stop the picker from moving emotes under the pointer; 2 also pauses animation |
| `eptips` | `1` | picker hover tip card on (off by default) |
| `epmove` | `0`–`6` | how emotes move when the picker changes their order |
| `eptabs` | comma list | picker sources: `7tv,bttv,ffz,twitch,emoji` |
| `epanim` | `anim`,`still` | picker animation filter (which kinds show) |
| `epfz` | `0`–`2` | emote pause scope: off / picker cells / everywhere |
| `epgeo` | `WxH[,L,T]` | picker box size (and float position, pinned) |
| `epopen` | flag | picker open state - the popup opens or stays closed |
| `overlay` | flag | [OBS](https://obsproject.com/) browser-source mode: transparent page, live rows only |
| `mid` | a message id | scroll to and flash that row on load (set by timestamp clicks) |
| `hw` | comma list | hide these logins' rows |
| `hwm` | `vanish`/`stub`/`ghost` | remove hidden users' messages, replace them with a count or leave them crossed out |

`theme=name` selects a preset that combines colours, fonts and other
display choices. The presets are:

- `old-default`, `compact`, `print`, `cosy`, `cinema`, `phosphor`,
  `dyslexic`, `midnight`, `solar`, `minimal`, `retro`, `irc`,
  `gohu`, `heather`, `nightshade`, `ft`, `ftdark`, `twitch`

The initial preset and the one used after a settings reset is
`nightshade`. `old-default` remains available. Some old preset names
still work: `theme=default` chooses `old-default`, while `paper`,
`mirc` and `console` choose their matching colour styles. `theme=dark`
also selects a colour style rather than a full preset.

The copy-settings button makes a URL with the current settings. When a
preset is selected, the URL includes only options changed from that
preset. A pick beside it can also open the `?` popup on a chosen page
(`?help=panel&htab=`…).

### Performance

- **Incoming chat:** the page groups messages before drawing them to
  avoid redrawing after every line.
- **Limits:** 10,000 visible rows by default; the user can raise the
  limit. Pending messages and the recent rows kept for reloads have
  separate limits so they cannot grow without bound.
- **Loading:** fonts do not hold up the first display. The about page
  uses smaller WebP screenshots.

## The Backend - `twitch-chat-relay` (GitHub Pages)

The [relay repository](https://github.com/mxmilkiib/twitch-chat-relay)
contains a single `index.html`. The chat page loads it as a hidden
iframe from `https://mxmilkiib.github.io/twitch-chat-relay/`.

The frontend tells the relay which channels to watch. The relay:

- connects to Twitch chat and reconnects when the connection drops
- checks the stream's title, viewer count and uptime every minute
- fetches Twitch badges, third-party emotes and recent stream details
- sends messages and retrieves missed chat when the frontend asks

The same relay can watch other Twitch channels without code changes.

### Message protocol

Parent → relay:

| message | purpose |
|---|---|
| `{type: 'join', channels[]}` | set the channels to watch (a bare `channel` string still works); repeats diff JOIN/PART |
| `{type: 'backfill'}` | ask for the recent-messages backlog (every joined channel, merged by timestamp) |
| `{type: 'auth', token}` | log in (or `token: null` to log out) |
| `{type: 'send', channel, text, replyTo}` | post a chat message once authenticated; `replyTo` attaches a `reply-parent-msg-id` tag |
| `{type: 'tweet', id}` | fetch an X/Twitter preview via the [FixTweet](https://github.com/FixTweet/FxTwitter) api (fxtwitter, then vxtwitter) |
| `{type: 'twsets', ids}` | fetch Twitch emote-set metadata via [ivr.fi](https://api.ivr.fi) |

Relay → parent:

- `{type: 'status', state}` - connecting / connected / reconnecting
- `{type: 'lines', lines[]}` - raw IRC lines, live or backfilled
- `backfill` - on request, the relay fetches the backlog from
  [recent-messages.robotty.de](https://recent-messages.robotty.de/)
  (the same service [Chatterino](https://chatterino.com/) uses) and
  forwards it as `lines`; the page skips already-rendered msg ids
- `{type: 'stream', channel, uptime, viewers, title}` - decapi poll
  result, per joined channel
- `{type: 'emotes', channel, emotes, emoteSrc, zeroWidth, badges,
  lastBroadcast, lastVod, emoteUse, emoteAnim}` - per-channel emote map +
  sources + badge sets + stream history + per-emote channel usage counts
  ([StreamElements](https://streamelements.com/) chatstats) +
  animated-emote names, refetched every
  10 minutes (global sets are fetched once per cycle and merged in)
- `{type: 'nitter', host}` - a [nitter](https://github.com/zedeus/nitter)
  instance verified live through the linkpeek worker; candidates are a
  built-in list plus [status.d420.de](https://status.d420.de/) picks, and
  [twiiit](https://twiiit.com/)'s per-click redirect answers when no
  instance verifies. Rechecked every 15 minutes
- `{type: 'wscause', code, reason}` - why the Twitch socket last closed,
  sent with each `reconnecting` status; the page shows it in the header
- `{type: 'repo', stars, created, pushed}` - GitHub metadata for the
  source row of the help popup
- `{type: 'auth', login}` (or `{type: 'auth', error}`) - after `auth`, the
  relay validates the token at
  [id.twitch.tv](https://dev.twitch.tv/docs/authentication/),
  reconnects the socket with
  the user's credentials, and reports the resolved login
- `{type: 'tweet', id, tweet}` - preview data for a tweet link
- `{type: 'twsets', key, sets}` - the emote-set metadata reply (`key`
  echoes the asked `ids`)

## vs. other Twitch chat clients

Where this sits relative to the usual suspects:

| | chat thing | Twitch site | Twitch embed | [Chatterino](https://chatterino.com/) | [Chatty](https://chatty.github.io/) | [jChat](https://www.giambaj.it/twitch/jchat/) | [DankChat](https://github.com/flex3r/DankChat) | [Chatsen](https://github.com/chatsen/chatsen) |
|---|---|---|---|---|---|---|---|---|
| form factor | one web page | web chat panel | iframe/popout | desktop app | desktop app (Java) | web overlay | Android app | iOS/Android app |
| install / build | none, static file | none | none | app install | JRE | none | Play / F-Droid | app stores |
| runs on strict-CSP static hosts | ✅ (relay iframe) | n/a | embed-domain rules | n/a | n/a | partial | n/a | n/a |
| send chat (login) | ✅ implicit OAuth | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ (+whispers) | ✅ |
| replies | quoted block, jump-back | ✅ threads | collapsed thread | ✅ | ✅ | ❌ | ✅ | ✅ |
| message permalinks | ✅ `?mid=` scroll + flash | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| chat search | ✅ text, `user:`, `kind:`, archive | partial | ❌ | ✅ | ✅ | ❌ | partial | ❌ |
| mute / hide users | ✅ hide·dim·count modes | block only | ❌ | ✅ ignores | ✅ | ❌ | ✅ | ✅ |
| polls / predictions / points | ❌ | ✅ | ❌ | partial | ❌ | ❌ | ✅ | partial |
| 7TV / BTTV / FFZ | ✅ animated, zero-width stacks | ❌ (extensions) | native only | ✅ | ✅ | partial | ✅ | ✅ |
| backfill after suspend/resume | ✅ (robotty) | recent only | ❌ | ✅ | ❌ | ❌ | history search | ❌ |
| msgs/sec graph, gap & burst marks | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| theming / accessibility fonts | palettes × 9-stop shade axis | light/dark | light/dark | extensive | extensive | CSS params | accent palettes | ✅ |
| multi-channel | ✅ up to 6 merged + per-tab | per page | per embed | tabs/splits | tabs | URL param | tabs | ✅ |
| second-screen / PWA install | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| emote picker | ✅ usage stats + era marks | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| nick / emote completion | ✅ @nicks + :/tab codes | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| input draft history (↑/↓) | ✅ readline-style | ✅ | partial | ❌ | ❌ | n/a | ❌ | ❌ |
| keyword / block-word filters | ✅ kw + bw | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| mention alerts | ✅ chip + opt. ping | partial | partial | ✅ sound/toast | ✅ | partial | ✅ | ✅ |
| link / media cards | ✅ x-cards, gifs, imgs, link/emote hovers | partial | partial | ✅ hover previews | partial | ❌ | ❌ | ❌ |
| x/twitter mirror | ✅ nitter via worker | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| link tools | ✅ links-only view, tracking strip | ❌ | ❌ | partial | partial | ❌ | ❌ | ❌ |
| pronouns | ✅ card + hovers | ❌ (ext.) | ❌ | ✅ | partial | ❌ | ✅ | ✅ |
| emote-only enlargement | ✅ 3 modes | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| gap notices (missed spans) | ✅ timed + cause | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| scrollback limit | ✅ 250–100k | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| scrollback persists | ✅ 1k rows + archive store | ❌ | ❌ | partial | ✅ logs | ❌ | ❌ | ❌ |
| cross-tab sync | ✅ opts + sent msgs | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| archive search | ✅ bounded or unbounded store | ❌ | ❌ | ❌ | partial logs | ❌ | ❌ | ❌ |
| draft length warn | ✅ fossa + 500 cap | ❌ | ❌ | ❌ | ❌ | n/a | ❌ | ❌ |
| usercard / mod UI | ✅ inspector + avatar + name chips + timeout/ban/delete | ✅ | partial | ✅ | ✅ | ❌ | ✅ | partial |
| whispers | ✅ pane + unread chip | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| stream stats line | ✅ uptime·viewers·chatters | viewers/uptime | ❌ | partial | ✅ | ❌ | partial | partial |
| session stats tab | ✅ chatters/emotes/bursts/storage | ❌ | ❌ | ❌ | partial logs | ❌ | ❌ | ❌ |
| pause scroll on hover | ✅ opt-in | partial | ❌ | ✅ | ✅ | ❌ | partial | ❌ |
| resource tabs | ✅ media·left·libre·authors·dsa | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| stream video alongside | ✅ drag/resize overlay | ✅ | ❌ | ❌ | partial ext. | ❌ | ❌ | ❌ |
| multi-column log | ✅ 2-3 page-flip + rail layouts | ❌ | ❌ | ✅ splits | partial | ❌ | ❌ | ❌ |
| screen-reader landmarks | ✅ live region + feeds | partial | partial | ❌ | ❌ | ❌ | partial | partial |
| config as shareable url | ✅ settings-as-query | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| free/libre/open source | ✅ AGPL | ❌ | ❌ | ✅ MIT | ✅ GPLv3+ | ✅ GPLv3 | ✅ MIT | ✅ AGPLv3 |

Broad strokes only - feature sets drift; Chatterino in particular is the
much deeper client if one lives at a desktop, the Twitch site carries
the platform-only surface (polls, predictions, channel points), and
DankChat/Chatsen cover the phone. The niche here is zero
install, a host that forbids sockets outright, and a page that treats
the stream's context (resources, history, rate graph) as part of chat.

## Lint

The page script lives inline in `index.html`; `eslint.config.mjs` lints
an extracted copy at `page-scan.js` (gitignored, never deployed):

    s=$(rg -n '^<script>' index.html | cut -d: -f1); e=$(rg -n '^</script>' index.html | cut -d: -f1)
    sed -n "$((s+1)),$((e-1))p" index.html > page-scan.js && eslint page-scan.js

## Deploy

    neocities-deploy deploy -s hasanabi.neocities.org

Using [neocities-deploy](https://github.com/kugland/neocities-deploy)
([AUR package](https://aur.archlinux.org/packages/neocities-deploy-bin)).
The relay deploys automatically via GitHub Pages on push.

## License

[AGPL-3.0-or-later](https://spdx.org/licenses/AGPL-3.0-or-later.html) - see [LICENSE](LICENSE).
