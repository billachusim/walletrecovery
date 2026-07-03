import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/unsubscribe")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Unsubscribe — walletrecovery.dev" },
      { name: "description", content: "Manage your email preferences for walletrecovery.dev." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UnsubscribePage,
});

type Status =
  | { kind: "loading" }
  | { kind: "no_token" }
  | { kind: "invalid" }
  | { kind: "already" }
  | { kind: "ready" }
  | { kind: "confirming" }
  | { kind: "success" }
  | { kind: "error"; message: string };

function UnsubscribePage() {
  const { token } = Route.useSearch();
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setStatus({ kind: "no_token" });
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/email/unsubscribe?token=${encodeURIComponent(token)}`);
        const body = await res.json();
        if (!res.ok) {
          setStatus({ kind: "invalid" });
          return;
        }
        if (body.valid === false && body.reason === "already_unsubscribed") {
          setStatus({ kind: "already" });
          return;
        }
        if (body.valid === true) {
          setStatus({ kind: "ready" });
          return;
        }
        setStatus({ kind: "invalid" });
      } catch (err) {
        setStatus({ kind: "error", message: err instanceof Error ? err.message : "Network error" });
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setStatus({ kind: "confirming" });
    try {
      const res = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const body = await res.json();
      if (res.ok && (body.success || body.reason === "already_unsubscribed")) {
        setStatus({ kind: "success" });
      } else {
        setStatus({ kind: "error", message: body.error ?? "Unsubscribe failed" });
      }
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Network error" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md font-mono">
        <p className="text-primary text-sm mb-2">walletrecovery.dev</p>
        <h1 className="text-2xl font-semibold mb-4">&gt; email_preferences</h1>

        {status.kind === "loading" && <p className="text-muted-foreground text-sm">&gt; verifying token...</p>}
        {status.kind === "no_token" && (
          <p className="text-sm">
            Missing unsubscribe token. Use the link at the bottom of any email we sent you.
          </p>
        )}
        {status.kind === "invalid" && (
          <p className="text-sm text-destructive">
            This unsubscribe link is invalid or has expired.
          </p>
        )}
        {status.kind === "already" && (
          <p className="text-sm">You have already unsubscribed from these emails.</p>
        )}
        {status.kind === "ready" && (
          <>
            <p className="text-sm mb-6">
              Click below to stop receiving emails from walletrecovery.dev at this address.
              You will still receive critical account and case-recovery communications you have
              an open case for.
            </p>
            <button
              type="button"
              onClick={confirm}
              className="w-full rounded-md bg-primary text-primary-foreground px-4 py-3 text-sm hover:opacity-90 transition"
            >
              &gt; confirm_unsubscribe
            </button>
          </>
        )}
        {status.kind === "confirming" && <p className="text-sm text-muted-foreground">&gt; processing...</p>}
        {status.kind === "success" && (
          <p className="text-sm">
            You have been unsubscribed. If this was a mistake, contact support to re-enable emails.
          </p>
        )}
        {status.kind === "error" && (
          <p className="text-sm text-destructive">Error: {status.message}</p>
        )}
      </div>
    </div>
  );
}
