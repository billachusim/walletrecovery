import { createFileRoute, Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Header } from "@/components/Header";
import { Terminal, ArrowRight } from "lucide-react";
import { submitGuestAssessment } from "@/lib/assessments.functions";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Free Wallet Recovery Assessment — Talk to an Agent | Wallet Recovery Agent" },
      { name: "description", content: "Free private terminal chat with the Wallet Recovery Agent. Qualify your lost crypto wallet case in minutes. No plaintext seed required. No recovery, no fee." },
      { property: "og:title", content: "Talk to the Agent — Wallet Recovery Agent" },
      { property: "og:description", content: "Free private assessment. Recover your wallet." },
      { property: "og:url", content: "/assessment" },
    ],
    links: [{ rel: "canonical", href: "/assessment" }],
  }),
  component: AssessmentPage,
});

const INITIAL_MESSAGES: UIMessage[] = [
  {
    id: "agent-boot-1",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "> connection established\n> node: agent.rcv // status: online\n> encryption: end-to-end\n\nhi. i'm agent.rcv. i qualify recovery cases before handing them to a senior operative.\n\nlet's start simple — what kind of wallet are we recovering? (btc, eth, hardware ledger/trezor, exchange lockout, other)",
      },
    ],
  },
];

function AssessmentPage() {
  const transport = useRef(new DefaultChatTransport({ api: "/api/agent" })).current;
  const { messages, sendMessage, status, error } = useChat({
    transport,
    messages: INITIAL_MESSAGES,
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  const busy = status === "submitted" || status === "streaming";

  const submit = () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    sendMessage({ text });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary/70">
          // session: {new Date().toISOString().slice(0, 10)}
        </div>
        <div className="mb-6 flex items-baseline gap-3">
          <Terminal className="h-5 w-5 text-primary text-glow-soft" />
          <h1 className="font-mono text-2xl font-bold text-primary text-glow">
            &gt; talk_to_agent
          </h1>
        </div>

        <div className="scanlines rounded border border-primary/50 bg-card/70 shadow-[0_0_40px_oklch(0.78_0.22_145/0.15)]">
          {/* Fake terminal titlebar */}
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 font-mono text-xs text-muted-foreground">
            <span>agent.rcv@secure ~ tty0</span>
            <span className="text-primary/70">● connected</span>
          </div>

          <div
            ref={scrollRef}
            className="h-[520px] overflow-y-auto px-4 py-4 font-mono text-sm leading-relaxed"
          >
            {messages.map((m) => (
              <MessageRow key={m.id} m={m} />
            ))}
            {status === "submitted" && (
              <div className="text-primary/70">
                <span className="text-primary">agent</span> &raquo; <span className="opacity-60">thinking</span><span className="terminal-caret ml-1" aria-hidden="true" />
              </div>
            )}
            {error && (
              <div className="mt-2 rounded border border-destructive/60 bg-destructive/10 p-3 text-destructive-foreground">
                &gt; error: {error.message || "connection lost. retry."}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => { e.preventDefault(); submit(); }}
            className="flex items-end gap-2 border-t border-border/60 p-3"
          >
            <span className="pb-2 font-mono text-primary text-glow">&gt;</span>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={1}
              disabled={busy}
              placeholder="type here. shift+enter for newline."
              className="max-h-32 min-h-[2.25rem] flex-1 resize-none bg-transparent font-mono text-sm text-foreground caret-primary outline-none placeholder:text-muted-foreground/50"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="flex h-9 items-center gap-1 rounded border border-primary/70 bg-primary/10 px-3 font-mono text-xs uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
            >
              [ send ] <ArrowRight className="h-3 w-3" />
            </button>
          </form>
        </div>

        <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
          the agent will never ask for a full seed phrase or private key. if it does, close this tab.
          <br />
          <Link to="/auth" className="mt-2 inline-block text-primary hover:text-glow">
            [ create an account to track progress ]
          </Link>
        </p>

        <ManualFallbackForm />
      </main>
    </div>
  );
}

function ManualFallbackForm() {
  const submit = useServerFn(submitGuestAssessment);
  const [email, setEmail] = useState("");
  const [walletType, setWalletType] = useState("");
  const [lossReason, setLossReason] = useState("");
  const [details, setDetails] = useState("");
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "submitting" }
    | { kind: "ok"; ref: string }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.kind === "submitting") return;
    setState({ kind: "submitting" });
    try {
      const res = await submit({
        data: {
          guest_email: email.trim(),
          wallet_type: walletType.trim(),
          loss_reason: lossReason.trim(),
          details: details.trim() || null,
        },
      });
      if (res.ok) {
        setState({ kind: "ok", ref: res.case_ref });
        setEmail("");
        setWalletType("");
        setLossReason("");
        setDetails("");
      } else {
        setState({ kind: "error", message: res.error });
      }
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const fieldCls =
    "w-full rounded border border-border/70 bg-background/60 px-3 py-2 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary/70";

  return (
    <section className="mt-10 rounded border border-primary/30 bg-card/50 p-5">
      <details>
        <summary className="cursor-pointer font-mono text-sm text-primary text-glow-soft">
          &gt; prefer a form? [ save case manually ]
        </summary>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          skip the chat. we&apos;ll route this straight to an operator.
        </p>

        {state.kind === "ok" ? (
          <div className="mt-4 rounded border border-primary/60 bg-primary/10 p-4 font-mono text-sm text-primary">
            &gt; case saved. ref:{" "}
            <span className="text-glow">{state.ref}</span>
            <br />
            an operator will reach out within 24–48h.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-4 grid gap-3">
            <div>
              <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={fieldCls}
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                wallet type
              </label>
              <input
                type="text"
                required
                maxLength={80}
                value={walletType}
                onChange={(e) => setWalletType(e.target.value)}
                placeholder="ledger, trezor, metamask, coinbase, other..."
                className={fieldCls}
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                loss reason
              </label>
              <input
                type="text"
                required
                maxLength={200}
                value={lossReason}
                onChange={(e) => setLossReason(e.target.value)}
                placeholder="forgot password, partial seed, damaged device..."
                className={fieldCls}
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                details (optional)
              </label>
              <textarea
                rows={3}
                maxLength={4000}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="anything relevant — do NOT include full seed phrases or private keys."
                className={fieldCls}
              />
            </div>

            {state.kind === "error" && (
              <p className="rounded border border-destructive/60 bg-destructive/10 p-2 font-mono text-xs text-destructive-foreground">
                &gt; save failed: {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={state.kind === "submitting"}
              className="mt-1 inline-flex h-10 items-center justify-center gap-1 rounded border border-primary/70 bg-primary/10 px-4 font-mono text-xs uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
            >
              {state.kind === "submitting" ? "[ saving... ]" : "[ save case ]"}
              <ArrowRight className="h-3 w-3" />
            </button>
          </form>
        )}
      </details>
    </section>
  );
}

function MessageRow({ m }: { m: UIMessage }) {
  const isUser = m.role === "user";
  const text = m.parts
    .map((p) => {
      if (p.type === "text") return p.text;
      if (p.type.startsWith("tool-")) return "";
      return "";
    })
    .join("");

  // Tool call badges
  const toolParts = m.parts.filter((p) => p.type.startsWith("tool-"));

  return (
    <div className="mb-4">
      <div className="mb-1 text-xs">
        {isUser ? (
          <span className="text-accent">user@you</span>
        ) : (
          <span className="text-primary text-glow-soft">agent.rcv</span>
        )}
        <span className="text-muted-foreground"> &raquo;</span>
      </div>
      {text && (
        <div
          className={
            isUser
              ? "whitespace-pre-wrap rounded border border-accent/40 bg-accent/10 px-3 py-2 text-foreground"
              : "whitespace-pre-wrap text-foreground/90"
          }
        >
          {text}
        </div>
      )}
      {toolParts.map((tp, i) => (
        <ToolBadge key={i} part={tp} />
      ))}
    </div>
  );
}

function ToolBadge({ part }: { part: UIMessage["parts"][number] }) {
  const anyPart = part as any;
  const toolName = String(part.type).replace(/^tool-/, "");
  const state: string = anyPart.state ?? "running";
  const done = state === "output-available";
  const output = anyPart.output;

  return (
    <details className="mt-2 rounded border border-primary/30 bg-background/40 px-3 py-1.5 font-mono text-xs">
      <summary className="cursor-pointer list-none text-primary/80">
        &gt; {toolName}
        <span className="ml-2 text-muted-foreground">
          [{done ? "done" : state === "input-available" ? "executing…" : "…"}]
        </span>
        {done && toolName === "save_assessment" && output?.ok && (
          <span className="ml-2 text-primary text-glow-soft">
            case ref: {output.case_ref}
          </span>
        )}
      </summary>
      {output && (
        <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-muted-foreground">
          {JSON.stringify(output, null, 2)}
        </pre>
      )}
    </details>
  );
}
