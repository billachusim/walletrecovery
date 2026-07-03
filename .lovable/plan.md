# Wallet Recovery as a Service (WRaaS) Platform

## Overview
Build a full-stack recovery platform for end customers who have lost access to cryptocurrency wallets. The platform prioritizes trust and transparency — essential in a market plagued by scams. It enables free recovery assessments, secure case submission with progress tracking, encrypted messaging, and educational content to build credibility.

## Phase 1: Infrastructure & Auth

### 1.1 Enable Lovable Cloud
- Activate Supabase-backed Lovable Cloud for auth, database, file storage, and serverless functions.

### 1.2 Authentication
- Email/password authentication + Google sign-in.
- Password reset flow (`/auth` public route, `/reset-password` page).
- User profiles table (`profiles`) linked to `auth.users(id)` with auto-creation trigger.
- Profile fields: full_name, display_name, avatar_url, phone, created_at, updated_at.
- Role-based access: `user` (customer) and `staff` (recovery team) via `user_roles` table.
- Auth state listener in `__root.tsx` for session changes.
- Protected routes under `/_authenticated/` with managed layout.
- Supabase auth attacher middleware in `src/start.ts`.

## Phase 2: Database Schema

### Tables
1. **profiles** — user profile data (FK to auth.users)
2. **user_roles** — role assignments (customer, staff, admin)
3. **assessments** — free recovery assessment submissions
   - id, user_id, wallet_type, loss_reason, details, partial_phrase, partial_password_hints, estimated_value, recovery_probability (staff-computed), status (pending/quoted/declined), created_at
4. **cases** — active recovery cases
   - id, user_id, assessment_id (nullable), title, description, wallet_type, status (submitted/in_review/forensics/recovery_attempt/success/failed/closed), estimated_value, fee_percentage, fee_amount, recovered_amount, created_at, updated_at, closed_at
5. **case_updates** — progress updates on cases
   - id, case_id, author_id (staff), message, stage, created_at
6. **case_messages** — secure messaging between customer and staff
   - id, case_id, sender_id, content, is_internal (staff-only flag), created_at
7. **documents** — file uploads linked to cases
   - id, case_id, file_name, file_path (storage), file_type, uploaded_by, created_at
8. **articles** — educational content / blog posts
   - id, title, slug, content, excerpt, author_id, published, created_at, updated_at

### RLS Policies
- Customers: read/write own assessments, read/write own cases, read own messages, read own documents.
- Staff: read all assessments, cases, messages, documents; write case updates and messages.
- Articles: public read for published articles.

### Row-Level Security Functions
- `has_role(user_id, role)` security definer function for role checks.

## Phase 3: Route Structure

### Public Routes
- `/` — Landing page (hero, trust signals, how it works, testimonials preview, CTA to assess)
- `/services` — Detailed service descriptions (password recovery, phrase reconstruction, file corruption, device damage)
- `/how-it-works` — Step-by-step process transparency
- `/pricing` — Fee structure (free assessment, forensic analysis, success-based fees)
- `/faq` — Frequently asked questions
- `/blog` or `/learn` — Educational articles and guides
- `/about` — Company info, team, trust credentials
- `/contact` — Contact form and support info
- `/auth` — Login/signup page
- `/reset-password` — Password reset page
- `/assessment` — Free recovery assessment form (public, no auth required to start)

### Protected Routes (`/_authenticated/`)
- `/dashboard` — Customer dashboard (my cases, assessments, messages)
- `/cases` — List of user's cases
- `/cases/$caseId` — Case detail with timeline, messages, documents
- `/assessments` — List of user's assessments
- `/assessments/$assessmentId` — Assessment detail and quote
- `/messages` — Message inbox
- `/profile` — Edit profile

### Staff Routes (`/_authenticated/staff/`)
- `/staff/dashboard` — Staff overview (pending assessments, active cases)
- `/staff/assessments` — Manage all assessments
- `/staff/cases` — Manage all cases
- `/staff/cases/$caseId` — Case management detail
- `/staff/articles` — Manage educational articles

## Phase 4: Core Features Implementation

### 4.1 Free Recovery Assessment (Public)
- Multi-step form: wallet type, loss scenario, available clues, estimated value, contact info.
- Validation with Zod.
- Server function to create assessment record.
- Immediate acknowledgment + email notification.
- Staff review workflow to compute recovery probability and send quote.

### 4.2 Case Submission & Tracking
- Convert approved assessments into cases, or direct case creation.
- Case status pipeline: Submitted → In Review → Forensics → Recovery Attempt → Success/Failed/Closed.
- Timeline UI showing status history and updates.
- Document upload to Supabase Storage (wallet files, device images, screenshots).
- Secure file handling with signed URLs.

### 4.3 Secure Messaging
- Threaded messaging per case (customer ↔ staff).
- Real-time updates via Supabase Realtime.
- Internal staff-only notes flag.
- Message history with timestamps.

### 4.4 Educational Content
- Public article listing and detail pages.
- Markdown-like rich text rendering (no dangerouslySetInnerHTML).
- Article categories: wallet safety, recovery tips, how-to guides, scam awareness.
- SEO-optimized with route-level head() metadata.

### 4.5 Dashboard
- Customer: summary cards (active cases, pending assessments, unread messages), recent activity feed.
- Staff: workload overview, pending items queue, quick actions.

## Phase 5: UI/UX & Design

### Visual Direction
- Trust-first, professional, calm aesthetic.
- Dark mode support via existing CSS tokens.
- Clean typography, generous whitespace.
- Security badges, SSL indicators, process transparency as visual trust signals.
- Progress indicators for case status.
- Card-based layouts for dashboards.

### Components Needed
- Header with navigation (public) / sidebar (authenticated).
- Footer with trust signals, legal links, contact.
- Assessment multi-step form.
- Case timeline/status tracker.
- Messaging thread component.
- Document upload/download.
- Dashboard stat cards and activity feed.
- Article card and detail layouts.
- Staff data tables with filtering.

## Phase 6: Legal & Compliance Surface

### Public Trust Pages
- `/privacy` — Privacy policy (data handling, retention).
- `/terms` — Terms of service (liability, success-based fees, chain of custody).
- `/security` — Security practices (encryption, storage, access controls).
- Builder-attributed content only — no unverified certifications.

## Technical Stack

- **Frontend**: React 19 + TanStack Start (SSR/SSG) + Tailwind CSS v4 + shadcn/ui components
- **Backend**: TanStack server functions (`createServerFn`) + Supabase Data API
- **Auth**: Lovable Cloud (Supabase Auth) — email/password + Google OAuth
- **Database**: PostgreSQL via Supabase with RLS policies
- **Storage**: Supabase Storage for case documents
- **Realtime**: Supabase Realtime for messaging
- **Validation**: Zod for all forms and API inputs
- **Payments**: Stripe integration for forensic analysis deposits and success fees (Phase 2)

## Out of Scope for V1
- Payment processing (Stripe) — included in schema but UI deferred to v2.
- AI-assisted password generation tools — conceptual placeholder only.
- Enterprise/law firm portal — B2B features deferred.
- Multi-language support.
- Advanced analytics dashboard for staff.

## Implementation Order
1. Enable Lovable Cloud + configure auth + create database schema.
2. Build public landing page + auth pages.
3. Build assessment form (public) + assessment list/detail (protected).
4. Build case management (submission, tracking, documents) — protected.
5. Build messaging system — protected.
6. Build educational content pages + staff article management.
7. Build dashboards (customer + staff).
8. Build trust/legal pages (privacy, terms, security).
9. Polish, test, and publish.
