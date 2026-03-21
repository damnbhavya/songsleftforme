# songsleftfor.me

for songs you never had the courage to send.

[songsleftfor.me](https://songsleftfor.me) is an anonymous song dedication wall. you pick a song, write a short message (or don't — sometimes the song says it all), and send it out into the world. no accounts, no usernames, no trace back to you. just a song and a feeling, left behind for someone.

i built this because i've had so many songs i wanted to send to people but never did. a spotify link sitting in the drafts, a song that reminded me of someone i couldn't talk to anymore. i figured i wasn't the only one.

---

## features

- **spotify search & embed** — search for any song on spotify right from the create page or paste a link directly. tracks play inline with the spotify iframe api, and only one song plays at a time across the whole page
- **anonymous dedications** — no sign-up, no login, no accounts. every dedication is completely anonymous. you just fill it out and it's there
- **masonry feed** — dedications show up in a pinterest-style masonry grid that reflows based on screen size. cards scroll-reveal as you go down
- **search & filter** — search dedications by name, song, or message. filter dropdown lets you narrow it down
- **10 color themes + a secret one** — there's a floating color picker with 10 themes (rose, ocean, violet, emerald, etc). if you try all 10, a secret "newsprint" theme unlocks — it turns the whole site into a newspaper-style editorial look with sharp corners, offset shadows, and dark spotify embeds
- **custom cursors** — the default, text, and pointer cursors are all custom svg cursors that change color with the theme
- **hover-bold text** — headings use a per-character weight animation that follows your mouse. on mobile it does an automatic wave sweep instead
- **input sanitization** — all user input goes through dompurify before hitting the database
- **lazy-loaded embeds** — spotify iframes only load when they scroll into view (intersection observer)
- **staggered entry animations** — page sections fade up with staggered delays on load
- **responsive** — works on mobile, tablet, desktop. the masonry grid goes from 3 columns to 2 to 1
- **vercel analytics** — basic analytics via `@vercel/analytics`

---

## tech stack

| layer | what |
|---|---|
| framework | [react 19](https://react.dev) + [typescript](https://typescriptlang.org) |
| build tool | [vite 7](https://vite.dev) |
| styling | [tailwindcss v4](https://tailwindcss.com) |
| database | [supabase](https://supabase.com) (postgres) |
| music | [spotify web api](https://developer.spotify.com/documentation/web-api) (client credentials) + [spotify iframe api](https://developer.spotify.com/documentation/embeds) |
| sanitization | [dompurify](https://github.com/cure53/DOMPurify) |
| icons | [lucide-react](https://lucide.dev) |
| fonts | source serif 4 (headings), cabinet grotesk (body) — self-hosted |
| hosting | [vercel](https://vercel.com) |
| analytics | [@vercel/analytics](https://vercel.com/analytics) |

---

## getting started

### prerequisites

- node.js 18+
- a supabase project with a `submissions` table
- spotify developer app credentials (client id + secret)

### setup

```bash
git clone https://github.com/damnbhavya/sentby.me.git
cd sentby.me
npm install
```

create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### supabase table

the app expects a `submissions` table with these columns:

| column | type | notes |
|---|---|---|
| `id` | uuid | primary key, default `gen_random_uuid()` |
| `recipient_name` | text | nullable, defaults to "someone" |
| `message` | text | nullable |
| `spotify_url` | text | required |
| `song_title` | text | nullable |
| `created_at` | timestamptz | default `now()` |

### run locally

```bash
npm run dev
```

open [http://localhost:5173](http://localhost:5173).

---

## project structure

```
src/
├── components/
│   ├── ColorPickerFAB.tsx    — floating theme picker with 10 themes + secret newsprint
│   ├── DedicationCard.tsx    — single dedication card (name, song, message)
│   ├── HoverBoldText.tsx     — per-character weight animation on hover
│   ├── SpotifyEmbed.tsx      — lazy-loaded spotify iframe with single-playback
│   └── SpotifySongSearch.tsx — debounced song search with album art dropdown
├── lib/
│   ├── cursors.ts            — generates themed svg cursors
│   ├── spotify.ts            — spotify web api client (client credentials flow)
│   └── supabase.ts           — supabase client + submission type
├── pages/
│   ├── Home.tsx              — feed page with masonry grid, search, scroll-reveal
│   ├── Create.tsx            — dedication form with live spotify preview
│   └── About.tsx             — about page with how-it-works + socials
├── App.tsx                   — routes with lazy-loaded pages
├── main.tsx                  — entry point, router setup, cursor init
└── index.css                 — theme tokens, animations, newsprint overrides
```

---

## deployment

the app is deployed on vercel. `vercel.json` handles spa routing (all paths rewrite to `index.html`) and sets cache headers for static assets and fonts.

```bash
npm run build
```

output goes to `dist/`.

---

## license

do whatever you want with it.
