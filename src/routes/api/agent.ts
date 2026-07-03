import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, tool, stepCountIs, type UIMessage } from "ai";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { notifyOperatorNewAssessment } from "@/lib/notify.server";

const SYSTEM_PROMPT = `You are AGENT.rcv — a laconic, competent operative for Wallet Recovery Agent, in a green-on-black terminal.
Voice: terse, technical, lowercase where natural. No exclamation marks. No hype. Prefix system messages with '>' occasionally.
Mission: qualify the user's crypto wallet recovery case in as few questions as possible.

Gather in this order (one focused question at a time, adapt to answers):
1. wallet type (BTC, ETH, hardware — ledger/trezor, metamask, trust wallet, exchange lockout, other)
2. loss reason (forgot password, partial seed, corrupted file, damaged device, deleted file, exchange lockout)
3. contact email (so a senior operative can follow up)
4. rough asset value (USD band)
5. key clues: when last accessed, device history, any partial seed word count, password hints/patterns

HARD RULES — NEVER BREAK:
- Never ask for a full seed phrase or private key. Ever.
- If a user tries to paste one, refuse and warn them.
- Only ask for partial info (word count, general hints).
- Keep messages short (2–4 lines).

PERSISTENCE RULES — CRITICAL, THIS IS HOW LEADS ARE CAPTURED:
- The MOMENT you have wallet_type + loss_reason + email, IMMEDIATELY call estimate_probability then save_assessment. Do NOT keep asking follow-up questions first. Value and clues can be null; better to save early and enrich later.
- Pass null for any field you don't have yet — do not stall to collect them.
- If the user seems to be wrapping up, wants to leave, hesitates, or has already given you email + wallet_type + loss_reason, call save_assessment NOW, then acknowledge.
- After save_assessment succeeds, send a final message with the case id (uppercase, first 8 chars) and tell them a senior Wallet Recovery Agent operative will contact them within 24–48h. Point them to /auth to create an account to track progress.
- If save_assessment returns ok:false, apologize once and ask the user to try the manual "save case" form below the terminal.

Stay in character. This is the Matrix. You are their operative on the inside.`;

const estimateProbability = tool({
  description: "Estimate recovery probability band based on wallet type, loss reason, and info completeness.",
  inputSchema: z.object({
    wallet_type: z.string(),
    loss_reason: z.string(),
    has_partial_seed: z.boolean(),
    has_password_hints: z.boolean(),
  }),
  execute: async ({ wallet_type, loss_reason, has_partial_seed, has_password_hints }) => {
    let score = 20;
    if (has_partial_seed) score += 35;
    if (has_password_hints) score += 25;
    if (/exchange/i.test(loss_reason)) score = Math.min(score, 40);
    if (/damaged/i.test(loss_reason)) score += 10;
    if (/hardware/i.test(wallet_type)) score += 5;
    score = Math.max(5, Math.min(90, score));
    const band = score < 25 ? "low" : score < 55 ? "moderate" : score < 75 ? "high" : "very high";
    return { probability_percent: score, band };
  },
});

export const Route = createFileRoute("/api/agent")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const url = process.env.SUPABASE_URL;
        const publishable = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!url || !publishable) return new Response("Missing Supabase env", { status: 500 });

        const body = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(body.messages)) {
          return new Response("messages required", { status: 400 });
        }

        const supabase = createClient(url, publishable, {
          auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
        });

        const saveAssessment = tool({
          description: "Persist the recovery assessment to the database. Call this once you have all core fields.",
          inputSchema: z.object({
            wallet_type: z.string(),
            loss_reason: z.string(),
            details: z.string().nullable(),
            partial_password_hints: z.string().nullable(),
            partial_phrase_word_count: z.number().nullable().describe("Number of seed words the user remembers, if any. Never store the words themselves."),
            estimated_value_usd: z.number().nullable(),
            guest_email: z.string(),
            recovery_probability: z.number(),
          }),
          execute: async (input) => {
            const { data, error } = await supabase
              .from("assessments")
              .insert({
                user_id: null,
                guest_email: input.guest_email,
                wallet_type: input.wallet_type,
                loss_reason: input.loss_reason,
                details: input.details,
                partial_password_hints: input.partial_password_hints,
                partial_phrase: input.partial_phrase_word_count
                  ? `[user recalled ${input.partial_phrase_word_count} words — content not stored]`
                  : null,
                estimated_value: input.estimated_value_usd,
                recovery_probability: input.recovery_probability,
              })
              .select("id, wallet_type, loss_reason, guest_email, estimated_value, recovery_probability")
              .single();
            if (error) {
              console.error("[agent.save_assessment] insert failed:", error.message, error.details ?? "");
              return { ok: false, error: error.message };
            }
            // Fire-and-forget operator notification. No-ops if email not configured.
            void notifyOperatorNewAssessment(data);
            return { ok: true, case_ref: String(data.id).slice(0, 8).toUpperCase(), full_id: data.id };
          },
        });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(body.messages),
          tools: { estimate_probability: estimateProbability, save_assessment: saveAssessment },
          stopWhen: stepCountIs(50),
        });

        return result.toUIMessageStreamResponse({ originalMessages: body.messages });
      },
    },
  },
});
