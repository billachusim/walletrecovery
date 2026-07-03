import { Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { ArrowRight } from "lucide-react";
import { RELATED_POSTS_BY_RECOVER } from "@/lib/related-content";

export interface RecoverFaq {
  q: string;
  a: string;
}

export interface RecoverPageProps {
  kicker: string;
  h1: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: RecoverFaq[];
  crumbTitle: string;
  slug: string;
}

export function RecoverPage({ kicker, h1, intro, sections, faqs, crumbTitle, slug }: RecoverPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <nav className="font-mono text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">~</Link>
          <span className="px-1">/</span>
          <span>recover</span>
          <span className="px-1">/</span>
          <span className="text-primary">{slug}</span>
        </nav>

        <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-primary/70">── {kicker} ──</p>
        <h1 className="mt-3 font-mono text-3xl font-bold text-primary text-glow md:text-4xl">{h1}</h1>
        <p className="mt-6 text-lg text-foreground/80">{intro}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 rounded border border-primary bg-primary px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground"
          >
            [ start free assessment ] <ArrowRight className="h-3 w-3" />
          </Link>
          <Link to="/pricing" className="font-mono text-sm text-muted-foreground hover:text-primary">
            // no recovery, no fee
          </Link>
        </div>

        <article className="mt-14 space-y-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-mono text-xl text-primary text-glow-soft">&gt; {s.heading}</h2>
              <div className="mt-3 whitespace-pre-line text-foreground/85">{s.body}</div>
            </section>
          ))}
        </article>

        <section className="mt-14">
          <h2 className="font-mono text-xl text-primary text-glow-soft">&gt; faq.md</h2>
          <dl className="mt-4 space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded border border-border/60 bg-card/60 p-5">
                <dt className="font-mono text-primary">Q: {f.q}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {RELATED_POSTS_BY_RECOVER[slug]?.length ? (
          <section className="mt-14">
            <h2 className="font-mono text-xl text-primary text-glow-soft">&gt; related_intel.md</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {RELATED_POSTS_BY_RECOVER[slug].map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group block rounded border border-border/60 bg-card/60 p-4 transition-colors hover:border-primary/60 hover:bg-card"
                  >
                    <span className="font-mono text-xs text-primary/70">// intel</span>
                    <p className="mt-1 font-mono text-sm text-primary group-hover:text-glow">{p.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-16 rounded border border-primary/60 bg-card/60 p-6">
          <p className="font-mono text-sm text-primary text-glow">&gt; open_case.sh</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Free private terminal session. Never asks for full seed. Human operative follow-up within 24h.
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

export function buildRecoverHead({
  slug,
  title,
  description,
  h1,
  faqs,
}: {
  slug: string;
  title: string;
  description: string;
  h1: string;
  faqs: RecoverFaq[];
}) {
  const path = `/recover/${slug}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: path },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: path }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Recover", item: "/recover" },
            { "@type": "ListItem", position: 3, name: h1, item: path },
          ],
        }),
      },
    ],
  };
}
