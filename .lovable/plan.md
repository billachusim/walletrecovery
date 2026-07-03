# Recovery Agent — Matrix Rebrand + AI Agent Assessment

Rebrand the platform to **Recovery Agent** with a green-on-black Matrix/hacker aesthetic, and replace the current 3-step form assessment with a conversational AI agent that qualifies cases in the browser. Paid recovery still handed off to human "senior operatives" — that handoff is the trust anchor.

## 1. Brand + Copy

- Name: **Recovery Agent** (from "Wallet Recovery")
- Tagline: *"Your operative on the inside."*
- Voice: terse, terminal-flavored, competent. No exclamation marks. Prefix section labels with `>` and `//`.
- Update: header logo, footer, page titles/meta, hero copy, all references to "Wallet Recovery" across `Header.tsx`, `__root.tsx`, `index.tsx`, `services.tsx`, `pricing.tsx`, `faq.tsx`, `contact.tsx`, `auth.tsx`.

## 2. Design System (Matrix theme)

`src/styles.css` — dark-first OKLCH tokens:
- `--background` near-black with green cast, `--foreground` phosphor green
- `--primary` matrix green (filled, on black, `text-glow`); `--accent` neon cyan
- Card = darker panel + 1px green border + scanline overlay
- Fonts: JetBrains Mono (headings/UI), Inter (body) — installed via `@fontsource/*` and imported in `src/start.tsx`
- Utilities: `.scanlines`, `.crt-flicker`, `.text-glow`, `.terminal-caret` (blinking)

`src/components/MatrixRain.tsx` — canvas rain, `pointer-events: none`, ~20fps, hidden on `prefers-reduced-motion: reduce`. Behind hero only, not full-app.

Shadcn: keep components, restyle via tokens + variants. No hardcoded colors in components.

## 3. AI Agent Assessment (the core change)

**Replace** the current 3-step form on `/assessment` with a terminal-style chat:

- New server route: `src/routes/api/agent.ts` — POST handler using AI SDK `streamText` through Lovable AI Gateway (`google/gemini-3-flash-preview`).
- New provider helper: `src/lib/ai-gateway.server.ts` (canonical Lovable Gateway snippet).
- System prompt: the Agent is a laconic recovery operative. It gathers wallet type, what's lost, approximate value, last-known access details, seed fragments, device history. It never asks for full seed phrases or private keys — hard rule in prompt.
- Tools (AI SDK `tool` + Zod `inputSchema`):
  - `save_assessment` — writes to existing `public.assessments` (works for guests via `user_id IS NULL` policy already in place). Returns assessment id + probability.
  - `estimate_probability` — pure function returning a probability band based on wallet type + info completeness.
- Loop control: `stopWhen: stepCountIs(50)`.
- Client: new `src/routes/assessment.tsx` using `useChat` + `DefaultChatTransport`, AI Elements (`conversation`, `message`, `prompt-input`, `shimmer`, `tool`). Assistant messages have no background; user messages are `primary`/`primary-foreground`. Render `message.parts`. Tool activity collapsed by default.
- Pre-fill from homepage CTA via `Route.useSearch()` seeds the agent's opening question.
- Handoff: when `save_assessment` succeeds, agent posts a final message with the case ref and a `[ Contact senior operative → ]` link (to `/auth` for guests, `/dashboard` for logged-in).

Install AI Elements: `bun x ai-elements@latest add conversation message prompt-input shimmer tool`.

Packages to add: `ai`, `@ai-sdk/openai-compatible`, `@ai-sdk/react`, `zod` (if not present), `@fontsource/jetbrains-mono`, `@fontsource/inter`.

## 4. Homepage rebuild (`src/routes/index.tsx`)

- Hero: Matrix rain backdrop, monospace headline "> initiate_recovery", subhead, single CTA `[ TALK TO AGENT → ]` linking `/assessment`. Small terminal-style sign-in link.
- Below fold: `> stats.json`, `> how_it_works.log` (3 steps: talk to agent → forensic review → recovery), `> testimonials.txt`, `> operatives.txt` (trust: credentials, no-recovery-no-fee).
- Footer: terminal-style legal + links.

## 5. Route restyle pass (no logic changes)

`services.tsx`, `pricing.tsx`, `faq.tsx`, `contact.tsx`, `auth.tsx`, `forgot-password.tsx`, `reset-password.tsx`, `_authenticated/dashboard.tsx`, `Header.tsx`:
- Monospace headings prefixed with `>`, `── section ──` dividers
- Terminal-style form fields (transparent, green underline focus)
- Auth: "> login --secure" / "> register --new-operative"
- Dashboard: "control room" — file-tree sidebar, neon status pills, monospace tables
- Per-route `head()` metadata updated to Recovery Agent branding (title, description, og:title, og:description)

## 6. Accessibility

- Matrix rain hidden on `prefers-reduced-motion: reduce`
- Text-glow tuned down on body copy (headings only) for readability
- All interactive elements keep visible green focus rings
- Contrast: body text passes AA on the dark background

## 7. Out of scope

- No new DB tables (existing `assessments`, `cases`, `case_messages`, etc. are reused).
- No schema changes beyond possibly adding a `transcript jsonb` column on `assessments` to store the agent conversation (only if needed — deferred if we can pack it into existing `additional_info`).
- No Stripe/payments, no staff console changes, no realtime messaging changes.
- No new languages, no analytics dashboards.

## Technical notes

- `LOVABLE_API_KEY` provisioned via `lovable_api_key--create` if not already set. Read only inside `/api/agent` handler.
- Provider built with default `structuredOutputs: false` (Gemini model — strict json_schema not needed).
- Guest assessments: agent's `save_assessment` tool inserts with `user_id: null`; existing RLS policy already permits.
- Font loading via `@fontsource/*` imported in `src/start.tsx` — no CDN `<link>`, no CSS `@import` of remote URLs.
- All AI logic server-side. Client only renders `useChat` stream.

## Implementation order

1. Install packages + AI Elements
2. `src/lib/ai-gateway.server.ts` provider helper
3. `src/routes/api/agent.ts` streaming route + tools
4. Design tokens in `src/styles.css` + fonts in `src/start.tsx`
5. `MatrixRain.tsx`
6. Rebuild `src/routes/assessment.tsx` with `useChat` + AI Elements
7. Rebuild `src/routes/index.tsx` (homepage)
8. Restyle pass on remaining routes + `Header.tsx`
9. Update per-route `head()` metadata
10. Browser test: homepage → agent chat → assessment saved → dashboard shows it
