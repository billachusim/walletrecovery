import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  guest_email: z.string().email(),
  wallet_type: z.string().min(1).max(80),
  loss_reason: z.string().min(1).max(200),
  details: z.string().max(4000).nullable().optional(),
});

export const submitGuestAssessment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    // Server-side privileged write: user-supplied fields are Zod-validated above
    // and everything else is server-controlled. RLS SELECT would otherwise block
    // the RETURNING clause for anon, so we use the admin client here.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error } = await supabaseAdmin
      .from("assessments")
      .insert({
        user_id: null,
        guest_email: data.guest_email,
        wallet_type: data.wallet_type,
        loss_reason: data.loss_reason,
        details: data.details ?? null,
      })
      .select("id, wallet_type, loss_reason, guest_email, estimated_value, recovery_probability")
      .single();

    if (error) {
      console.error("[assessment] insert failed:", error.message);
      return { ok: false as const, error: error.message };
    }

    const ref = String(row.id).slice(0, 8).toUpperCase();

    // Fire-and-forget email dispatch (assessment-received to user + operator alert).
    try {
      const { enqueueTransactionalEmail } = await import("@/lib/email/enqueue.server");
      void Promise.all([
        enqueueTransactionalEmail({
          templateName: "assessment-received",
          recipientEmail: row.guest_email ?? undefined,
          idempotencyKey: `assessment-received-${row.id}`,
          templateData: {
            case_ref: ref,
            wallet_type: row.wallet_type,
            loss_reason: row.loss_reason,
            is_authenticated: false,
          },
        }),
        enqueueTransactionalEmail({
          templateName: "operator-new-assessment",
          idempotencyKey: `operator-new-assessment-${row.id}`,
          templateData: {
            case_ref: ref,
            wallet_type: row.wallet_type,
            loss_reason: row.loss_reason,
            contact_email: row.guest_email,
            estimated_value: row.estimated_value,
            recovery_probability: row.recovery_probability,
            is_authenticated: false,
          },
        }),
      ]).catch((err) => console.error("[assessment] email dispatch failed:", err));
    } catch (err) {
      console.error("[assessment] enqueue import failed:", err);
    }

    return {
      ok: true as const,
      case_ref: ref,
    };
  });
