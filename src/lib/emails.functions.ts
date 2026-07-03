import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SITE_URL = "https://walletrecovery.dev";

async function loadCaseWithEmail(caseId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: caseRow, error } = await supabaseAdmin
    .from("cases")
    .select("id, user_id, title, wallet_type, status")
    .eq("id", caseId)
    .single();
  if (error || !caseRow) return null;

  const { data: userRes, error: userErr } = await supabaseAdmin.auth.admin.getUserById(
    caseRow.user_id,
  );
  if (userErr || !userRes?.user?.email) return null;
  return { caseRow, email: userRes.user.email };
}

async function requireStaff(supabase: ReturnType<typeof getSupabaseClientPlaceholder>) {
  return null; // placeholder; middleware injects supabase
}
// Silence unused — kept for future.
function getSupabaseClientPlaceholder() {
  return null as never;
}

/** Sends the "case opened" email to the case owner. Staff only. */
export const sendCaseOpenedEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ caseId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    // Verify caller is staff or admin
    const [{ data: isStaff }, { data: isAdmin }] = await Promise.all([
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "staff" }),
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
    ]);
    if (!isStaff && !isAdmin) {
      throw new Response("Forbidden", { status: 403 });
    }

    const loaded = await loadCaseWithEmail(data.caseId);
    if (!loaded) return { ok: false as const, reason: "case_not_found" };
    const { caseRow, email } = loaded;
    const ref = caseRow.id.slice(0, 8).toUpperCase();

    const { enqueueTransactionalEmail } = await import("@/lib/email/enqueue.server");
    const result = await enqueueTransactionalEmail({
      templateName: "case-opened",
      recipientEmail: email,
      idempotencyKey: `case-opened-${caseRow.id}`,
      templateData: {
        case_ref: ref,
        case_title: caseRow.title,
        wallet_type: caseRow.wallet_type,
        dashboard_url: `${SITE_URL}/dashboard`,
        case_url: `${SITE_URL}/case/${caseRow.id}`,
      },
    });
    return { ok: result.ok, reason: result.reason };
  });

/** Sends the "case status update" email. Staff only. */
export const sendCaseStatusUpdateEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        caseId: z.string().uuid(),
        newStatus: z.string().min(1).max(80),
        note: z.string().max(4000).nullable().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const [{ data: isStaff }, { data: isAdmin }] = await Promise.all([
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "staff" }),
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
    ]);
    if (!isStaff && !isAdmin) {
      throw new Response("Forbidden", { status: 403 });
    }

    const loaded = await loadCaseWithEmail(data.caseId);
    if (!loaded) return { ok: false as const, reason: "case_not_found" };
    const { caseRow, email } = loaded;
    const ref = caseRow.id.slice(0, 8).toUpperCase();

    const { enqueueTransactionalEmail } = await import("@/lib/email/enqueue.server");
    const result = await enqueueTransactionalEmail({
      templateName: "case-status-update",
      recipientEmail: email,
      idempotencyKey: `case-status-${caseRow.id}-${data.newStatus}-${Date.now()}`,
      templateData: {
        case_ref: ref,
        case_title: caseRow.title,
        new_status: data.newStatus,
        note: data.note ?? null,
        dashboard_url: `${SITE_URL}/dashboard`,
        case_url: `${SITE_URL}/case/${caseRow.id}`,
      },
    });
    return { ok: result.ok, reason: result.reason };
  });
