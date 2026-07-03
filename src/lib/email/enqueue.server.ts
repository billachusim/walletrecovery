// Server-only helper for enqueueing transactional emails from trusted server
// contexts (server functions, server-route handlers, MCP tools). Uses the
// service-role client and mirrors the logic in
// src/routes/lovable/email/transactional/send.ts, minus the user-JWT gate.
//
// Do NOT import this from client-reachable code at module scope — always
// dynamic-import inside handlers.

import * as React from "react";
import { render } from "react-email";
import { TEMPLATES } from "@/lib/email-templates/registry";

const SITE_NAME = "walletrecovery";
const SENDER_DOMAIN = "notify.walletrecovery.dev";
const FROM_DOMAIN = "walletrecovery.dev";

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function redactEmail(email: string | null | undefined): string {
  if (!email) return "***";
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  return `${local[0]}***@${domain}`;
}

export interface EnqueueArgs {
  templateName: string;
  recipientEmail?: string;
  templateData?: Record<string, unknown>;
  idempotencyKey?: string;
}

export async function enqueueTransactionalEmail(args: EnqueueArgs): Promise<{
  ok: boolean;
  reason?: string;
  message_id?: string;
}> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const supabase = supabaseAdmin;

  const template = TEMPLATES[args.templateName];
  if (!template) {
    console.error("[email] template not registered", { name: args.templateName });
    return { ok: false, reason: "template_not_found" };
  }

  const effectiveRecipient = template.to || args.recipientEmail;
  if (!effectiveRecipient) {
    return { ok: false, reason: "recipient_missing" };
  }

  const messageId = crypto.randomUUID();
  const idempotencyKey = args.idempotencyKey || messageId;
  const normalizedEmail = effectiveRecipient.toLowerCase();

  // Suppression check
  const { data: suppressed, error: suppressionError } = await supabase
    .from("suppressed_emails")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (suppressionError) {
    console.error("[email] suppression check failed", { error: suppressionError });
    return { ok: false, reason: "suppression_check_failed" };
  }

  if (suppressed) {
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: args.templateName,
      recipient_email: effectiveRecipient,
      status: "suppressed",
    });
    return { ok: false, reason: "email_suppressed" };
  }

  // Unsubscribe token
  let unsubscribeToken: string;
  const { data: existingToken } = await supabase
    .from("email_unsubscribe_tokens")
    .select("token, used_at")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existingToken && !existingToken.used_at) {
    unsubscribeToken = existingToken.token;
  } else if (!existingToken) {
    unsubscribeToken = generateToken();
    await supabase
      .from("email_unsubscribe_tokens")
      .upsert(
        { token: unsubscribeToken, email: normalizedEmail },
        { onConflict: "email", ignoreDuplicates: true },
      );
    const { data: storedToken } = await supabase
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", normalizedEmail)
      .maybeSingle();
    if (!storedToken) return { ok: false, reason: "token_storage_failed" };
    unsubscribeToken = storedToken.token;
  } else {
    // Token used but not on suppression list — treat as suppressed.
    return { ok: false, reason: "email_suppressed" };
  }

  // Render
  const element = React.createElement(
    template.component,
    (args.templateData ?? {}) as Record<string, unknown>,
  );
  const html = await render(element);
  const plainText = await render(element, { plainText: true });
  const resolvedSubject =
    typeof template.subject === "function"
      ? template.subject((args.templateData ?? {}) as Record<string, unknown>)
      : template.subject;

  // Log pending
  await supabase.from("email_send_log").insert({
    message_id: messageId,
    template_name: args.templateName,
    recipient_email: effectiveRecipient,
    status: "pending",
  });

  const { error: enqueueError } = await supabase.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      message_id: messageId,
      to: effectiveRecipient,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject: resolvedSubject,
      html,
      text: plainText,
      purpose: "transactional",
      label: args.templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  });

  if (enqueueError) {
    console.error("[email] enqueue failed", {
      error: enqueueError,
      template: args.templateName,
      recipient_redacted: redactEmail(effectiveRecipient),
    });
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: args.templateName,
      recipient_email: effectiveRecipient,
      status: "failed",
      error_message: "Failed to enqueue email",
    });
    return { ok: false, reason: "enqueue_failed" };
  }

  console.log("[email] enqueued", {
    template: args.templateName,
    recipient_redacted: redactEmail(effectiveRecipient),
  });
  return { ok: true, message_id: messageId };
}
