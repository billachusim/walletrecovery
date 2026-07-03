## What I found

- **Dashboard has no header at all** — that's why there's no way home from `/dashboard`. The "Wallet Recovery" text you're seeing is the browser tab title getting truncated. The `/console` page does have a header (with `wallet_recovery_agent` as a home link), but on narrow widths the wordmark can clip.
- **Your assessment isn't in the database.** `SELECT * FROM assessments` returns 0 rows — the AI agent chat ended without calling the `save_assessment` tool, so nothing was written and no operator email fired. Staff RLS is fine (it would show guest rows if they existed); the problem is the save never happened.

## Plan

### 1. Nav on every screen, brand always goes home

- Add the shared `<Header />` to `/dashboard` (currently missing).
- In `Header.tsx`: keep the `<Link to="/">` wrapping the logo + wordmark, but make it survive narrow widths — `min-w-0` on the link, `truncate` on the wordmark, `shrink-0` on the logo icon. Full `wallet_recovery_agent` shows on desktop; on very narrow phones it truncates gracefully instead of clipping the layout.
- Console header already exists; the same brand-link fix flows through since both use the shared `<Header />`.

### 2. Mobile menu styled as the brand mark

Replace the lucide `Menu` / `X` hamburger icons with a small terminal-style toggle button that matches the `>_` motif:

- **Closed** (menu hidden): renders `_` — just the underscore glyph in primary green, blinking caret feel.
- **Open** (menu shown): renders `>` — the chevron in primary green.
- Fixed-width mono font, same 8×8 target as before, `aria-label` still "Toggle menu", `aria-expanded` still bound.
- Bonus: the mobile dropdown menu already collapses when you tap a link (`onClick={() => setMobileOpen(false)}`), and a click on the toggle re-collapses it — no change needed there.

### 3. Fix the "assessment vanished" problem

Two-layer fix so we never lose a lead again:

**a) Make the AI reliably persist.** Tighten `SYSTEM_PROMPT` in `src/routes/api/agent.ts` to mandate calling `save_assessment` as soon as it has `wallet_type + loss_reason + email` (even if other fields are still null), then continue the conversation. Add server-side logging in the `save_assessment` handler when the insert errors so we can see failures in gateway logs.

**b) Add a visible fallback form on `/assessment`.** A small `[ save case manually ]` section below the terminal chat with four fields (email, wallet type, loss reason, notes). Direct anon insert into `assessments` (the existing "Anyone can submit guest assessments" policy already allows this). Also fires the operator notification via the same `notifyOperatorNewAssessment` server function (moved to a tiny `createServerFn` so the form can trigger it).

Anyone who talks to the agent OR just fills the fallback form ends up in the DB → visible in `/console` under `/assessments` with a "guest" pill.

### 4. Console guest-row polish

- On the `/console` queue, show a small "guest" chip when `user_id IS NULL` and show the `guest_email` as the primary contact line so operators can reach out.

### Out of scope

- Verifying the operator email actually delivered (requires `RESEND_API_KEY` + `OPERATOR_EMAIL` secrets, or Lovable Email domain setup — separate turn if you want it).
- Reworking the assessment agent's conversation logic beyond the prompt tightening above.

### Technical notes

- Header remains one component; both `/dashboard` and `/console` share it.
- Mobile toggle uses two `<span>`s (chevron / underscore) rendered conditionally — no image asset needed.
- Fallback form → `createServerFn({ method: "POST" })` in `src/lib/assessments.functions.ts` that uses the server publishable client (RLS-enforced) to insert, then fires `notifyOperatorNewAssessment`. No admin key needed.
- Once implemented, guest-submitted rows show in `/console` automatically thanks to the existing `Staff can read all assessments` RLS policy.

Reply "go" to build it.
