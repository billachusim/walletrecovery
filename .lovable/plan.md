# Wallet Recovery Agent — Logo & Favicon

## The mark

Build on the existing `>_` motif (currently a generic lucide `Terminal` icon in the header). Turn it into a real brand mark:

- **Glyph:** stylized `>_` — a chevron/prompt with a blinking-caret underscore, drawn as a single geometric shape (not a font character). Sharp 45° chevron, thick underscore bar to its right, slight terminal-CRT feel.
- **Container:** rounded square tile with a 1px inner stroke, so it reads clearly as an app icon at 16–32px and as a brand tile at 512px.
- **Palette:** matte black background (`#0A0A0A`), primary green foreground matching the site's `--primary` (terminal green). Monochrome — no gradients, no glow baked in (glow stays a CSS effect in the app).
- **Voice:** hacker-terminal, operative, precise. Not cutesy.

Deliverables (all vector-first where possible):

```text
public/favicon.svg           — master SVG mark (tile + >_)
public/favicon.png           — 512×512 PNG (browsers, PWA)
public/favicon-32.png        — 32×32 PNG
public/favicon-16.png        — 16×16 PNG
public/apple-touch-icon.png  — 180×180 PNG
public/og-image.png          — 1200×630 social card built around the mark
src/assets/logo-mark.svg     — SVG used inline in Header (replaces lucide Terminal)
/mnt/documents/wallet-recovery-agent-logo.zip
                             — downloadable bundle: SVG + all PNG sizes + og-image
```

The `/mnt/documents` bundle is what the user downloads. I'll surface it with a `<presentation-artifact>` tag.

## Wire-up

1. **Header** (`src/components/Header.tsx`): replace `<Terminal className="h-4 w-4" />` with an inline `<LogoMark />` component that renders the SVG mark. Keep the wordmark `wallet_recovery_agent` and the blinking caret as-is.
2. **Favicon** (`src/routes/__root.tsx`):
   - Replace the current `{ rel: "icon", href: "/favicon.ico" }` link with:
     - `{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }`
     - `{ rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" }`
     - `{ rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16.png" }`
     - `{ rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }`
   - Delete `public/favicon.ico` (per template rule).
3. **Social preview** (`og:image`): add on leaf routes only (`index.tsx` first, then `services`, `pricing`, `faq`, `about`, `blog` index). Absolute URL built from request origin via a small `getRequestOrigin` server fn (matches the SSR head rules). Also set `twitter:image` to the same URL. Not added on `__root.tsx`.
4. **Blog post og:image**: use the same site-wide `og-image.png` fallback; per-post custom images out of scope for this task.

## Technical section

- Generate `public/favicon.svg` by hand (small, ~40 lines of SVG) so it's crisp at every size and the primary green matches `hsl(var(--primary))` — hardcoded as the hex equivalent since SVG can't read CSS vars from `<link rel="icon">`.
- Generate the PNG sizes with `imagegen--edit_image` re-framing the SVG, OR by using the `canvas-design`/`sharp`-free path: I'll instead use `imagegen--generate_image` with `premium` quality once for the master tile, then produce sized PNGs with a short Python/PIL script in `/tmp` (PIL is available). This avoids AI-drift between sizes.
- OG card: 1200×630 composition — mark on the left, wordmark + tagline "Your operative on the inside." + "No recovery, no fee." on the right, matte-black background, subtle terminal-scanline texture. Generated with `imagegen--generate_image` at `premium` quality (has text), then verified visually.
- `getRequestOrigin` server fn added under `src/lib/origin.functions.ts` (client-safe module path per server-fn rules).
- Zip bundle assembled with `python -m zipfile`.
- QA: view every generated PNG and the og-image before delivery; re-render if anything is off.

## Out of scope

- Per-blog-post custom og images
- Animated logo variants
- Renaming the current terminal-caret span

Ready to build on approval.