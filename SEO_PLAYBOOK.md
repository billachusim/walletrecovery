# Wallet Recovery Agent — SEO & Outreach Playbook

Living document. Update as things move.

## 1. Search Console setup (do first)

- [ ] Verify domain in Google Search Console
- [ ] Verify in Bing Webmaster Tools
- [ ] Submit `/sitemap.xml` to both
- [ ] Set up Google Business Profile (once a real address / phone is available)
- [ ] Set up Bing Places listing
- [ ] Confirm `robots.txt` and `llms.txt` are reachable at project root

## 2. On-page SEO — already done in code

- Unique title, description, og:title, og:description on every route
- Canonical + self-referencing og:url on every leaf
- Organization + WebSite JSON-LD sitewide
- FAQPage JSON-LD on `/faq` and every `/recover/*` page
- Article JSON-LD on every blog post
- BreadcrumbList on blog posts and recover pages
- Semantic HTML: single h1, article, section
- `robots.txt` explicitly allowing GPTBot, Google-Extended, PerplexityBot, ClaudeBot, CCBot, Bingbot
- `llms.txt` for AI crawler discovery
- Dynamic sitemap that includes all published blog posts

## 3. Content cadence (target: 2 Intel posts/month)

Suggested next topics, in priority order:

1. "Coinbase account recovery: the 2026 escalation playbook" — targets *coinbase account recovery*, high volume
2. "Trezor Model T PIN forgotten: what you can do" — targets *trezor forgot pin*
3. "How SIM-swap attacks steal crypto — and how to reclaim the account" — trust content
4. "Old Bitcoin wallet from 2013: how to open a wallet.dat you can't decrypt" — long-tail nostalgia searchers
5. "Ledger phishing scams in 2026: current tactics and how to spot them" — timely
6. "Do you need a lawyer for exchange lockout recovery?" — E-E-A-T authority piece
7. "Anonymized case file #025: recovering a Trezor with 20 of 24 words" — social proof
8. "What's inside a BIP-39 checksum, and why it matters for recovery" — technical authority
9. "Are 'crypto recovery bots' on Telegram legit? (No.)" — scam-awareness magnet
10. "The difference between wallet recovery and asset tracing" — clarifies market position

## 4. Backlink targets

**Tier 1 — high authority, hard to land:**
- Investopedia / Cointelegraph / CoinDesk (via HARO / Qwoted)
- Wired, Ars Technica security desks (via research-worthy blog posts)
- Bitcoin Magazine (guest post pitch)

**Tier 2 — medium authority, plausible:**
- r/CryptoCurrency wiki (recovery services section)
- r/ledgerwallet, r/TREZOR, r/Metamask (help threads, cited as resource)
- CryptoCompare
- Bitcoin.com
- Ledger's own community forum

**Tier 3 — easy wins:**
- Web3 directories (Alchemy, dApp lists, etc.)
- Reddit AMAs on smaller crypto subs
- Podcast guest appearances (What Bitcoin Did, Bankless, The Defiant)
- YouTube guest slots (BTC Sessions, Coin Bureau)

## 5. Reddit strategy

**Rules first:**
- Never post promotionally. Every sub will ban you.
- Contribute genuinely. Build karma over months, not days.
- When someone asks about wallet recovery, help — link only when it's clearly the best answer.

**Priority subs:**
- r/CryptoCurrency — huge, cautious about promo
- r/ledgerwallet — service-focused, very open to help
- r/TREZOR
- r/Metamask
- r/bitcoin — strict rules, high signal
- r/ethereum
- r/CryptoRecovery — small but exactly-targeted

## 6. YouTube Shorts (30-sec each)

Format: green-on-black terminal aesthetic, no talking heads (or masked). Each script under 100 words.

- "How to spot a wallet recovery scam in 15 seconds"
- "Why we never ask for your seed phrase"
- "The math of recovering a lost BIP-39 word"
- "Ledger locked? Your keys are (probably) fine"
- "Real case: 4.2 BTC recovered in 2 hours"

Cross-post to TikTok, X/Twitter, Instagram Reels.

## 7. HARO / Qwoted / SourceBottle

Sign up for daily journalist queries. Reply when queries match:
- Crypto recovery / scam awareness
- Digital forensics
- Password security research
- Hardware wallet security

One placed quote in a Tier 1 outlet = 6 months of organic authority-building.

## 8. Directories to submit to

- Trustpilot (once you have some reviews)
- BBB (US) if applicable
- Clutch.co (B2B)
- The Verge business directory
- G2 (if you formalize as a SaaS-adjacent service)
- Better Business Bureau
- Web3 industry directories

## 9. Metrics to track

- Weekly: total impressions, top 10 queries (Search Console)
- Weekly: new referring domains (Semrush / Ahrefs free tools)
- Monthly: keyword rank movement on the 6 recover/* pages and top 5 posts
- Monthly: AI-search visibility — manually check if `google.com/generate/`, Perplexity, and Gemini surface us for target queries

## 10. Anti-scam positioning

This is a differentiator. Lean into it in every piece of content:
- "We refuse full seed phrases" — repeat everywhere
- "No recovery, no fee" — repeat everywhere
- Publish the scam-awareness content aggressively
- The `/blog/how-wallet-recovery-really-works` post is your most linkable asset — feature it prominently

---

Update this file every quarter. If a channel isn't producing, kill it. If a tactic works, double.
