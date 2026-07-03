import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const inputSchema = z.object({
  guest_email: z.string().email(),
  wallet_type: z.string().min(1).max(80),
  loss_reason: z.string().min(1).max(200),
  details: z.string().max(4000).nullable().optional(),
});

export const submitGuestAssessment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const url = process.env.SUPABASE_URL;
    const publishable = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !publishable) {
      return { ok: false as const, error: "Server misconfigured." };
    }

    const supabase = createClient(url, publishable, {
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    });

    const { data: row, error } = await supabase
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

    try {
      const { notifyOperatorNewAssessment } = await import("@/lib/notify.server");
      void notifyOperatorNewAssessment(row);
    } catch (err) {
      console.error("[assessment] notify import failed:", err);
    }

    return {
      ok: true as const,
      case_ref: String(row.id).slice(0, 8).toUpperCase(),
    };
  });
