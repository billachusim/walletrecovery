import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { ArrowRight, ShieldCheck, Terminal, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Wallet Recovery Agent | Who Recovers Your Crypto" },
      {
        name: "description",
        content:
          "Meet the operatives behind Wallet Recovery Agent. Forensic engineers, crypto veterans, and security researchers with 10+ years recovering lost wallets. No recovery, no fee.",
      },
      { property: "og:title", content: "About Wallet Recovery Agent" },
      { property: "og:description", content: "Who we are. Why you can trust us with your case." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary/70">── dossier ──</p>
        <h1 className="mt-3 font-mono text-4xl font-bold text-primary text-glow md:text-5xl">
          &gt; about_us.md
        </h1>
        <p className="mt-6 text-lg text-foreground/80">
          Wallet Recovery Agent is a small crew of forensic engineers, security researchers, and
          crypto veterans. We do one thing: get lost cryptocurrency back into the hands of the
          people it belongs to.
        </p>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          <Stat label="years operating" value="8+" />
          <Stat label="cases processed" value="1,200+" />
          <Stat label="assets returned (ytd)" value="$14.2M" />
        </section>

        <section className="mt-16">
          <h2 className="font-mono text-2xl text-primary text-glow">&gt; the_operatives</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Operative
              handle="cipher"
              role="lead forensic engineer"
              bio="12 years in digital forensics. Ex-federal contractor. Specializes in damaged drives and BIP-39 partial reconstruction."
            />
            <Operative
              handle="glitch"
              role="cryptographer"
              bio="PhD in applied cryptography. Publishes on password entropy and GPU-accelerated brute-force. Never asks for full seeds."
            />
            <Operative
              handle="ghost"
              role="hardware wallet specialist"
              bio="Reverse engineer. Deep knowledge of Ledger and Trezor secure elements. Physical device chain-of-custody lead."
            />
            <Operative
              handle="rook"
              role="operations & client trust"
              bio="Handles case intake, contracts, and communication. Every client speaks to a human within 24 hours."
            />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-mono text-2xl text-primary text-glow">&gt; why_us.md</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Pillar icon={<Terminal className="h-5 w-5" />} title="never asks for seeds" body="Our workflow never requires a full seed phrase or private key. Anyone who asks is a scam." />
            <Pillar icon={<ShieldCheck className="h-5 w-5" />} title="no recovery, no fee" body="You pay a percentage of what we return. Nothing recovered means nothing owed." />
            <Pillar icon={<Users className="h-5 w-5" />} title="humans, not bots" body="AI qualifies your case. Humans do the recovery. Every step is signed and logged." />
          </div>
        </section>

        <div className="mt-16 rounded border border-primary/60 bg-card/60 p-6">
          <p className="font-mono text-sm text-primary text-glow">&gt; open_case.sh</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Free assessment. Signed agreement before any recovery work begins.
          </p>
          <Link
            to="/assessment"
            className="mt-4 inline-flex items-center gap-2 rounded border border-primary bg-primary px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground"
          >
            [ talk to agent ] <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border/60 bg-card/60 p-5 font-mono">
      <div className="text-2xl text-primary text-glow">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Operative({ handle, role, bio }: { handle: string; role: string; bio: string }) {
  return (
    <div className="rounded border border-border/60 bg-card/60 p-5">
      <div className="font-mono text-primary text-glow">@{handle}</div>
      <div className="mt-1 font-mono text-xs uppercase tracking-wider text-primary/70">{role}</div>
      <p className="mt-3 text-sm text-muted-foreground">{bio}</p>
    </div>
  );
}

function Pillar({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded border border-border/60 bg-card/60 p-5">
      <div className="text-primary text-glow-soft">{icon}</div>
      <div className="mt-3 font-mono text-sm text-primary"># {title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
