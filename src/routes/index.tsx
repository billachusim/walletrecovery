import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { MatrixRain } from "@/components/MatrixRain";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Lock, ShieldCheck, Cpu, KeyRound } from "lucide-react";

type LatestPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
};

const latestPostsQuery = queryOptions({
  queryKey: ["blog", "posts", "latest3"],
  queryFn: async (): Promise<LatestPost[]> => {
    const { data, error } = await supabase
      .from("articles")
      .select("id,title,slug,excerpt,category")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3);
    if (error) throw error;
    return (data ?? []) as LatestPost[];
  },
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(latestPostsQuery),
  head: () => ({
    meta: [
      { title: "Wallet Recovery Agent — Recover Lost Crypto Wallets & Seed Phrases" },
      { name: "description", content: "Lost your seed phrase, forgot your wallet password, or bricked your Ledger? Wallet Recovery Agent runs a private AI-agent assessment then hands off to senior human operatives. No recovery, no fee." },
      { property: "og:title", content: "Wallet Recovery Agent — Recover Lost Crypto Wallets" },
      { property: "og:description", content: "Talk to the Agent. Recover your wallet. No recovery, no fee." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { data: latestPosts } = useSuspenseQuery(latestPostsQuery);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <MatrixRain />
        <div className="relative mx-auto max-w-5xl px-4 py-24 md:py-36">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary/70">// classified access</p>
          <h1 className="mt-4 font-mono text-4xl font-bold text-primary text-glow md:text-6xl">
            &gt; wallet_recovery<span className="terminal-caret ml-1" aria-hidden="true" />
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/80">
            Lost your seed. Forgot your password. Bricked your Ledger. Locked out of your exchange.
            Talk to the Agent — a private terminal that qualifies your case, estimates recovery odds,
            and hands you to a senior operative who does the work.{" "}
            <span className="text-primary text-glow-soft">No recovery, no fee.</span>
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/assessment"
              className="group inline-flex items-center gap-2 rounded border border-primary bg-primary px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_30px_oklch(0.78_0.22_145/0.4)] transition-all hover:shadow-[0_0_50px_oklch(0.78_0.22_145/0.7)]"
            >
              [ talk to agent ]
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/auth" className="font-mono text-sm text-muted-foreground hover:text-primary">
              ~/existing-operatives &raquo; sign in
            </Link>
          </div>

          <div className="mt-14 grid max-w-2xl gap-2 font-mono text-xs text-muted-foreground">
            <div><span className="text-primary">$</span> ping wallet.recovery.agent — <span className="text-primary/80">alive</span></div>
            <div><span className="text-primary">$</span> assessments_today — <span className="text-primary/80">247</span></div>
            <div><span className="text-primary">$</span> wallets_recovered_ytd — <span className="text-primary/80">$14.2M</span></div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-border/50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary/70">── operations ──</p>
          <h2 className="mt-3 font-mono text-3xl font-bold text-primary text-glow">&gt; services.log</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ServiceCard href="/recover/forgotten-password" icon={<KeyRound className="h-5 w-5" />} title="password_recovery" description="brute-force with your hints. we crack what you almost remember." />
            <ServiceCard href="/recover/hardware-wallet" icon={<Cpu className="h-5 w-5" />} title="hardware_wallet" description="ledger, trezor, keepkey. pin, firmware, physical device recovery." />
            <ServiceCard href="/recover/seed-phrase" icon={<Lock className="h-5 w-5" />} title="partial_seeds" description="reconstruction of 11-of-12 or 23-of-24 BIP-39 phrases. mathematics, not guessing." />
            <ServiceCard href="/recover/exchange-lockout" icon={<ShieldCheck className="h-5 w-5" />} title="exchange_lockouts" description="documented recovery escalation with major custodians and account resurrection." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/50 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary/70">── protocol ──</p>
          <h2 className="mt-3 font-mono text-3xl font-bold text-primary text-glow">&gt; how_it_works.sh</h2>
          <div className="mt-10 space-y-4 font-mono text-sm">
            <Step n="01" title="talk to agent" body="a private terminal. the agent asks the right questions. never asks for full seed or keys. takes 3 minutes." />
            <Step n="02" title="forensic review" body="a senior operative — a human — reads your file within 24h. transparent fee quote. you decide." />
            <Step n="03" title="recovery attempt" body="signed agreement. chain-of-custody. you only pay a success fee if we hand your assets back." />
          </div>
        </div>
      </section>

      {/* Latest Intel */}
      {latestPosts.length > 0 && (
        <section className="border-t border-border/50 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary/70">── field notes ──</p>
                <h2 className="mt-3 font-mono text-3xl font-bold text-primary text-glow">&gt; intel.latest</h2>
              </div>
              <Link to="/blog" className="font-mono text-xs text-muted-foreground hover:text-primary">
                all_intel &raquo;
              </Link>
            </div>
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {latestPosts.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group block h-full rounded border border-border/60 bg-card/60 p-5 transition-colors hover:border-primary/60 hover:bg-card"
                  >
                    {p.category && (
                      <span className="font-mono text-xs uppercase tracking-wider text-primary/70">
                        // {p.category}
                      </span>
                    )}
                    <h3 className="mt-2 font-mono text-sm text-primary group-hover:text-glow">
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Trust */}
      <section className="border-t border-border/50 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary/70">── trust ──</p>
          <h2 className="mt-3 font-mono text-3xl font-bold text-primary text-glow">&gt; why_us.md</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <TrustCard title="# no recovery, no fee" body="you pay a percentage of what we return. nothing recovered means nothing owed." />
            <TrustCard title="# never your keys" body="the agent will refuse a full seed phrase. our workflow never requires one plaintext." />
            <TrustCard title="# signed agreements" body="every case starts with a legal contract defining ownership, fees, and audit trails." />
            <TrustCard title="# chain of custody" body="physical devices are logged, tracked, and returned. every step recorded." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 px-4 py-24">
        <div className="mx-auto max-w-3xl rounded border border-primary/60 bg-card p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <MatrixRain />
          </div>
          <div className="relative">
            <h2 className="font-mono text-3xl font-bold text-primary text-glow">&gt; don't_give_up.txt</h2>
            <p className="mt-4 text-foreground/80">
              a few high-value recoveries have changed lives. yours might be one of them. free assessment.
              no obligation. no plaintext seed required.
            </p>
            <Link
              to="/assessment"
              className="mt-8 inline-flex items-center gap-2 rounded border border-primary bg-primary px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-primary-foreground"
            >
              [ talk to agent ]
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 font-mono text-xs text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} wallet_recovery_agent // your operative on the inside</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center">
            <Link to="/services" className="hover:text-primary">services</Link>
            <Link to="/pricing" className="hover:text-primary">pricing</Link>
            <Link to="/blog" className="hover:text-primary">intel</Link>
            <Link to="/faq" className="hover:text-primary">faq</Link>
            <Link to="/about" className="hover:text-primary">about</Link>
            <Link to="/contact" className="hover:text-primary">contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ icon, title, description, href }: { icon: React.ReactNode; title: string; description: string; href: string }) {
  return (
    <Link
      to={href}
      className="block rounded border border-border/60 bg-card/60 p-5 transition-colors hover:border-primary/60 hover:bg-card"
    >
      <div className="text-primary text-glow-soft">{icon}</div>
      <h3 className="mt-3 font-mono text-sm text-primary">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded border border-border/60 bg-card/60 p-5">
      <div className="flex items-baseline gap-4">
        <span className="text-primary text-glow">[{n}]</span>
        <div className="flex-1">
          <div className="text-primary">{title}</div>
          <p className="mt-1 font-sans text-sm text-muted-foreground">{body}</p>
        </div>
      </div>
    </div>
  );
}

function TrustCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded border border-border/60 bg-card/60 p-5">
      <div className="font-mono text-sm text-primary">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
