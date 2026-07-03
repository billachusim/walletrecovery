## Plan: SEO improvements 1–5

### 1. Fix sitemap `BASE_URL`
- `src/routes/sitemap[.]xml.ts`: set `BASE_URL = "https://walletrecovery.dev"` (currently empty, shipping `<loc></loc>` entries).

### 2. Clean up `__root.tsx` head
- Remove the duplicate `<meta name="description">` (second one overrides with weaker "Secure Recovery Hub…" copy).
- Remove root-level `og:image` and `twitter:image` — per head-meta rules these concatenate into every route and override leaf images. Move to leaves (step 3).
- Fix the duplicate weaker og:description ("Secure Recovery Hub…") to match the strong description already used for the title.

### 3. Per-post `og:image` on blog posts
- `src/routes/blog.$slug.tsx`: if the post row has a cover/hero image field, emit `og:image` + `twitter:image` from `loaderData`. If no cover image column exists, add a single branded fallback `og:image` for blog posts only (keeping other routes clean so hosting injects the project preview). I'll check the `articles` schema first to decide.
- Also add a branded default `og:image` on the home route (`index.tsx`) since that's the most-shared URL.

### 4. Internal linking between recover pages ↔ blog posts
- `src/components/RecoverPage.tsx`: add a "Related intel" section that links to 2–3 relevant blog posts per recover page (passed in as prop, or filtered by category tag).
- `src/routes/blog.$slug.tsx`: add a "Related recovery service" CTA block linking to the matching `/recover/*` page based on post category/tags.
- Wire the mapping in each `recover.*.tsx` route so it passes the right related-post slugs.

### 5. Semrush competitive analysis (research, no code)
- Run `semrush--domain_analysis` on `walletrecovery.dev` (US database) to snapshot current visibility.
- Run `semrush--competitive_analysis` to auto-discover organic competitors and keyword gaps.
- Run `semrush--serp_analysis` on 2–3 top target keywords ("wallet recovery", "seed phrase recovery", "metamask password recovery") to assess difficulty.
- Deliver a short summary: top 3 competitors, top 10 keyword gaps worth targeting, difficulty read on primary terms, and one concrete next content move. No files written.

### Notes
- All `og:image` / meta changes take effect for new crawls only — cached previews on X/LinkedIn/Slack won't update until each platform re-fetches. I'll mention this after publish.
- Search Console verification (from the earlier list) is deliberately excluded here — happy to do it as a follow-up once these ship.
