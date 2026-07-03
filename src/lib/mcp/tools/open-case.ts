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
  name: "open_case",
  title: "Open recovery case",
  description:
    "Open a formal recovery case for the signed-in user. Optionally link to an existing assessment.",
  inputSchema: {
    title: z.string().min(1).describe("Short case title, e.g. 'Ledger — forgotten PIN'."),
    wallet_type: z.string().min(1),
    description: z.string().nullable().describe("Additional context. Never include seed phrases or private keys."),
    estimated_value_usd: z.number().nullable(),
    assessment_id: z.string().uuid().nullable().describe("Existing assessment id to attach to this case, if any."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("cases")
      .insert({
        user_id: ctx.getUserId(),
        assessment_id: input.assessment_id,
        title: input.title,
        wallet_type: input.wallet_type,
        description: input.description,
        estimated_value: input.estimated_value_usd,
        status: "submitted",
      })
      .select("id, title, wallet_type, status, created_at")
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [
        {
          type: "text",
          text: `Case opened. ref: ${String(data.id).slice(0, 8).toUpperCase()}. Status: submitted.`,
        },
      ],
      structuredContent: { case: data, case_ref: String(data.id).slice(0, 8).toUpperCase() },
    };
  },
});
