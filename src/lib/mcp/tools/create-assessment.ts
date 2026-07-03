import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "create_assessment",
  title: "Create assessment",
  description:
    "Submit a new wallet recovery assessment for the signed-in user. Never include full seed phrases or private keys — only wallet type, loss reason, and safe details/hints.",
  inputSchema: {
    wallet_type: z
      .string()
      .min(1)
      .describe("Wallet or platform (e.g. bitcoin, ethereum, ledger, trezor, metamask, trust wallet, exchange lockout)."),
    loss_reason: z
      .string()
      .min(1)
      .describe("How access was lost (forgot password, partial seed, corrupted file, damaged device, deleted file, exchange lockout)."),
    details: z.string().nullable().describe("Free-form context about the situation. Never include full seed phrases or private keys."),
    partial_password_hints: z.string().nullable().describe("Hints/patterns about the password. Never full passwords."),
    partial_phrase_word_count: z
      .number()
      .int()
      .min(0)
      .max(24)
      .nullable()
      .describe("Number of seed words the user recalls. The words themselves are never stored."),
    estimated_value_usd: z.number().nullable().describe("Rough USD value of the wallet."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("assessments")
      .insert({
        user_id: ctx.getUserId(),
        guest_email: ctx.getUserEmail() ?? null,
        wallet_type: input.wallet_type,
        loss_reason: input.loss_reason,
        details: input.details,
        partial_password_hints: input.partial_password_hints,
        partial_phrase: input.partial_phrase_word_count
          ? `[user recalled ${input.partial_phrase_word_count} words — content not stored]`
          : null,
        estimated_value: input.estimated_value_usd,
      })
      .select("id, wallet_type, loss_reason, status, created_at")
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [
        {
          type: "text",
          text: `Assessment created. ref: ${String(data.id).slice(0, 8).toUpperCase()}. A senior operative will review it and follow up within 24–48h.`,
        },
      ],
      structuredContent: { assessment: data, case_ref: String(data.id).slice(0, 8).toUpperCase() },
    };
  },
});
