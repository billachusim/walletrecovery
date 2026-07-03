// Server-only. Sends an operator notification when a new assessment is submitted.
// No-ops silently when RESEND_API_KEY or OPERATOR_EMAIL is not set — this keeps
// the assessment flow working before email is configured.

export interface AssessmentPayload {
  id: string;
  wallet_type: string;
  loss_reason: string;
  guest_email: string | null;
  estimated_value: number | null;
  recovery_probability: number | null;
}

export async function notifyOperatorNewAssessment(a: AssessmentPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OPERATOR_EMAIL;
  const from = process.env.OPERATOR_EMAIL_FROM ?? "Wallet Recovery Agent <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn(
      "[notify] Skipping operator email: RESEND_API_KEY or OPERATOR_EMAIL missing.",
    );
    return;
  }

  const ref = a.id.slice(0, 8).toUpperCase();
  const subject = `New assessment ${ref} — ${a.wallet_type}`;
  const html = `
    <div style="font-family:ui-monospace,Menlo,Consolas,monospace;background:#0a0a0a;color:#4ade80;padding:24px;border-radius:8px">
      <h2 style="color:#4ade80;margin:0 0 12px">&gt; new_assessment received</h2>
      <p style="color:#e5e5e5"><strong>Ref:</strong> ${ref}</p>
      <p style="color:#e5e5e5"><strong>Wallet:</strong> ${escapeHtml(a.wallet_type)}</p>
      <p style="color:#e5e5e5"><strong>Loss reason:</strong> ${escapeHtml(a.loss_reason)}</p>
      <p style="color:#e5e5e5"><strong>Contact:</strong> ${escapeHtml(a.guest_email ?? "—")}</p>
      <p style="color:#e5e5e5"><strong>Est. value:</strong> ${a.estimated_value ? `$${a.estimated_value}` : "—"}</p>
      <p style="color:#e5e5e5"><strong>Probability:</strong> ${a.recovery_probability ?? "—"}%</p>
      <p style="color:#a3a3a3;margin-top:16px">Review in the operator console.</p>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[notify] Resend failed ${res.status}: ${body}`);
    }
  } catch (err) {
    console.error("[notify] Resend threw:", err);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
