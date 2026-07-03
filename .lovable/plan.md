## Where we are — round check

**Shipped and working**

- Public site (all with per-route SEO metadata + JSON-LD):
  - Home, `/services`, `/pricing`, `/faq`, `/about`, `/contact`, `/assessment`
  - Intel: `/blog` index + 7 published articles including the new `coinbase-recovery-guide` (with FAQPage schema)
  - Landing pages: `/recover/exchange-lockout`, `/forgotten-password`, `/hardware-wallet`, `/metamask`, `/seed-phrase`, `/trust-wallet`
- Auth: `/auth`, `/forgot-password`, `/reset-password`, protected `_authenticated/dashboard`
- Backend: Lovable Cloud with `articles`, `assessments`, `cases`, `case_messages`, `case_updates`, `documents`, `profiles`, `user_roles`
- Security: previous scan findings fixed (sender_id / uploaded_by enforcement, ownership-transfer triggers, has_role EXECUTE scope)
- Brand: `>_` logo mark, favicon set, apple-touch-icon, og-image, unified header nav (`/services`, `/pricing`, `/intel`, `/faq`, `/about`, `/login`)
- Discovery: dynamic `/sitemap.xml`, `robots.txt`, `llms.txt`, agent chat endpoint at `/api/agent`

**Open items**

- SEO scan still lists 1 failing finding: "Add a Coinbase recovery guide" — this is **stale**. The article is published at `/blog/coinbase-recovery-guide`. Just needs to be marked fixed (rescan will confirm).
- 0 real users, 0 assessments, 0 cases — no data flowing yet. The funnel is live but untested end-to-end by a real submission.
- No traffic yet — the site hasn't been submitted to Google Search Console / Bing Webmaster Tools.
- `dashboard.tsx` is the only authenticated surface; staff (admin/staff role) has no console to triage assessments or manage cases.
- No email/notifications on assessment submission (operator won't know when a lead lands).
- Payments not wired (Stripe/Paddle) — pricing page describes tiers but there's no checkout / retainer flow.

## Suggested next moves (pick any — this plan just decides direction, no code yet)

Ranked by leverage:

1. **Close the SEO loop** *(1 min)* — mark the stale Coinbase finding fixed and trigger a rescan.
2. **Staff console** *(medium)* — `_authenticated/console` for `staff|admin` roles: list assessments, convert to case, message thread, case-updates timeline. Currently there's no way to actually work a lead that comes in.
3. **Assessment → notification** *(small)* — send an email (Lovable Email) to a configured operator address when a new assessment lands. Optional Slack webhook via connector.
4. **End-to-end smoke test** *(small)* — submit a fake assessment, log in, verify it appears, confirm RLS still lets the owner read it after the ownership-transfer trigger.
5. **Search Console + Bing submission** *(user-side, we prep)* — add verification meta tag support, confirm sitemap URL, and hand over the checklist.
6. **Payments** *(large)* — enable Stripe/Paddle for the retainer + success-fee flow described on `/pricing`. Only worth doing after 2–3 real cases validate the pricing model.
7. **More intel posts** *(ongoing)* — cover the remaining high-intent keywords (Ledger recovery, Trezor recovery, Trust Wallet import failure, Binance withdrawal locked). Sitemap already picks them up automatically.
8. **Analytics** *(small)* — Plausible or PostHog on the public routes so we can see which recovery landing pages convert to `/assessment` starts.

## What I'd do first if it were up to me

Do 1 + 2 + 3 in one pass: mark the SEO finding fixed, build the staff console, wire operator email on new assessment. That turns the site from "brochure with a form" into an actual working operations surface — which is the smallest change that makes the next real case handleable.

Reply with a number (or a combo) and I'll write the implementation plan for it.
