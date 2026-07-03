## Wallet Recovery Agent — Rebrand + Heavy SEO/AI-visibility push

Approved plan, updated with a bigger blog focus and header nav placement.

---

### 1. Rebrand: Recovery Agent → Wallet Recovery Agent

Replace brand string across `Header.tsx`, `__root.tsx` (title, og:site_name, Organization JSON-LD), `index.tsx`, `services.tsx`, `pricing.tsx`, `faq.tsx`, `contact.tsx`, `auth.tsx`, footer, and the AI agent system prompt in `src/routes/api/agent.ts`. Tagline unchanged: *"Your operative on the inside."*

### 2. Blog — prominent, SEO-heavy, themed UI label

- **Backend/URL:** `/blog` and `/blog/$slug` (keeps SEO clean — crawlers and AI models recognize `/blog`)
- **UI label in header nav:** I'll use **`> intel/`** (fits the terminal/hacker theme, reads as "intel drops from the field"). If you prefer, alternatives are `> field_notes/`, `> dispatch/`, `> ops_log/`, `> the_leak/` — but I'll go with `> intel/` unless you say otherwise.
- **Header nav updated:** Home · Services · Pricing · **Intel** · FAQ · Contact · [ TALK TO AGENT ]
- **Homepage:** new `> intel.latest` section above the footer showing the 3 most recent posts as terminal-styled cards
- **Blog index (`/blog`):** grid of posts with tag filters (Seed Phrases, Hardware Wallets, Scam Awareness, How-To, Case Files)
- **Blog post (`/blog/$slug`):** terminal-styled article layout, reading time, tags, related posts, CTA to `/assessment`, sticky TOC on desktop

Data source: `articles` table already exists in Cloud. I'll wire the routes to it, then seed **5 posts** via the insert tool (not migration — data only).

### 3. Five seed blog posts (fully written, ~800–1200 words each, keyword-targeted)

1. **"Lost your seed phrase? Here's what actually works in 2026"** — targets *lost seed phrase recovery*
2. **"How wallet recovery really works (and how to spot the scams)"** — targets *crypto recovery scam*, *legit wallet recovery service*
3. **"Ledger locked out? Trezor bricked? Hardware wallet recovery, explained"** — targets *ledger recovery*, *trezor recovery*
4. **"MetaMask password forgotten — 6 recovery paths ranked by success rate"** — targets *forgot metamask password*
5. **"11 of 12 words: can a partial seed phrase be recovered?"** — targets *partial seed phrase recovery* (long-tail, low competition)

Each includes an FAQ block (5 Q&As) marked up as **FAQPage schema** — this is prime AI Overview / Gemini answer bait.

### 4. Per-route SEO metadata (unique on every page)

Rewrite `head()` on every route with keyword-targeted title/description/og. Examples:

- `/` — "Wallet Recovery Agent — Recover Lost Crypto Wallets & Seed Phrases"
- `/services` — "Crypto Wallet Recovery Services — Seed Phrase, Password, Hardware Wallet"
- `/assessment` — "Free Wallet Recovery Assessment — Talk to an Agent"
- `/pricing` — "Wallet Recovery Pricing — No Recovery, No Fee"
- `/faq` — "Wallet Recovery FAQ — How It Works, Cost, Safety"
- `/blog` — "Intel — Wallet Recovery Guides, Case Files & Scam Alerts"
- `/blog/$slug` — pulled from the article row

Self-referencing `og:url` + `<link rel="canonical">` on every leaf.

### 5. Structured data (JSON-LD) — the AI-search unlock

- **Organization** + **WebSite** with `SearchAction` sitewide in `__root.tsx`
- **Service** schema on `/services` (one per recovery type)
- **FAQPage** schema on `/faq` AND on each blog post's FAQ block
- **Article** schema on each blog post (author, datePublished, image)
- **BreadcrumbList** on `/blog/$slug` and the `/recover/*` pages

### 6. Keyword landing pages (SEO long-tail)

Six focused routes under `/recover/*`, each ~600–900 words with FAQPage schema and CTA to `/assessment`:

- `/recover/seed-phrase`
- `/recover/forgotten-password`
- `/recover/hardware-wallet`
- `/recover/metamask`
- `/recover/trust-wallet`
- `/recover/exchange-lockout`

### 7. Technical SEO plumbing

- `public/robots.txt` — allow all, explicitly allow `GPTBot`, `Google-Extended`, `PerplexityBot`, `ClaudeBot`, `CCBot`, `Bingbot`; references sitemap
- `src/routes/sitemap[.]xml.ts` — server route listing every public route + every published blog post (loader mirrors the article list, filtered to published rows)
- `public/llms.txt` — short markdown index for AI crawlers, points to `/services`, `/faq`, `/blog`, `/recover/*`
- Semantic HTML pass: single `<h1>` per page, proper `<article>`/`<section>`, `alt` text
- Header nav updated to expose Intel + a "Recover" dropdown for the six landing pages

### 8. Trust / E-E-A-T signals (weighted heavily by AI models)

- New `/about` route with "Operatives" credentials block (years of experience, cases handled, tools used)
- Anonymized case studies on `/` ("Recovered 4.2 BTC after 3-year seed phrase gap")
- "No recovery, no fee" pledge repeated on `/`, `/pricing`, `/services`
- Public PGP key block on `/contact` (trust signal + fits theme)

### 9. Non-code outreach playbook

`SEO_PLAYBOOK.md` at repo root with an actionable checklist you own:

- Google Search Console + Bing Webmaster submission steps
- Reddit strategy for `r/CryptoCurrency`, `r/ledgerwallet`, `r/Metamask`
- YouTube Shorts format ideas (30-sec terminal-aesthetic case studies)
- Backlink targets (HARO, crypto-security blogs, web3 directories)
- Suggested cadence for new Intel posts (~2/month) with the topics I'd prioritize next

---

### Out of scope this turn

- Payment integration
- i18n / translations
- Comments on blog posts
- Article authoring UI in dashboard (posts seeded via insert tool for now)

### Technical notes

- New routes follow TanStack Start conventions in `src/routes/`
- Blog post route is `src/routes/blog.$slug.tsx` with a loader hitting the `articles` table via TanStack Query + `ensureQueryData`
- Blog index is `src/routes/blog.index.tsx`; layout at `src/routes/blog.tsx` returns `<Outlet />`
- Head metadata via each route's `head()`; canonical + `og:url` are relative until a custom domain is connected
- JSON-LD injected via each route's `scripts` array
- No schema changes needed — `articles` table already exists
- Seed data written via the insert tool, not a migration
- After implementation I'll trigger an SEO scan and fix findings

Approve to build.