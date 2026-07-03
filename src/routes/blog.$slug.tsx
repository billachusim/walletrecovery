import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import { RELATED_RECOVER_BY_CATEGORY } from "@/lib/related-content";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  content: string;
  created_at: string;
  updated_at: string;
};

const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog", "post", slug],
    queryFn: async (): Promise<Post> => {
      const { data, error } = await supabase
        .from("articles")
        .select("id,title,slug,excerpt,category,content,created_at,updated_at")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data as Post;
    },
  });

type FaqItem = { q: string; a: string };

const POST_FAQS: Record<string, FaqItem[]> = {
  "coinbase-recovery-guide": [
    {
      q: "Can Coinbase reverse a transaction I sent to the wrong person?",
      a: "No — and neither can anyone else. Public blockchain transactions are irreversible by design. Coinbase can sometimes recover funds you sent to your own Coinbase-controlled address on a supported wrong network, but never funds that left their custody to a third party.",
    },
    {
      q: "How long does Coinbase account recovery take?",
      a: "The mandatory security wait after a 2FA reset is typically 24–72 hours. Full ID-verified recovery for complex cases (email compromise, name changes, old accounts) can take 2–6 weeks. Wrong-chain deposit recoveries take 4–12 weeks when accepted.",
    },
    {
      q: "Does Coinbase have a recovery phrase for my Coinbase.com account?",
      a: "No. Only Coinbase Wallet (the self-custody product) uses a seed phrase. Coinbase.com custodial accounts use email, password, and 2FA — anyone asking for a Coinbase seed phrase for a Coinbase.com account is a scammer.",
    },
    {
      q: "What does Coinbase's wrong-chain recovery cost?",
      a: "Coinbase typically charges 5% of the recovered balance with a $100 minimum, only for supported networks and tokens, and only after a manual review that can take months. Unsupported networks are declined outright.",
    },
    {
      q: "Is it safe to give a recovery service my seed phrase?",
      a: "No. A legitimate recovery service will never require your full seed phrase in plaintext. Wallet Recovery Agent's workflow is built so that no operative ever sees a complete phrase — we use partial data, checksums, and cryptographic search. If anyone asks for your full 12 or 24 words up front, walk away.",
    },
    {
      q: "Can I recover a Coinbase account with only my email?",
      a: "Not on its own. You'll need the email, access to a linked payment method or ID, and either your 2FA or the ability to prove ownership via ID verification. If you've lost the email inbox too, escalate immediately — the account is at risk of takeover.",
    },
  ],
};

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params, context }) => context.queryClient.ensureQueryData(postQuery(params.slug)),
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Post not found — Wallet Recovery Agent" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData;
    const desc = p.excerpt ?? `${p.title} — Wallet Recovery Agent intel.`;
    const faqs = POST_FAQS[params.slug];
    const scripts: Array<{ type: string; children: string }> = [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          description: desc,
          datePublished: p.created_at,
          dateModified: p.updated_at,
          author: { "@type": "Organization", name: "Wallet Recovery Agent" },
          publisher: { "@type": "Organization", name: "Wallet Recovery Agent" },
          mainEntityOfPage: `/blog/${params.slug}`,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Intel", item: "/blog" },
            { "@type": "ListItem", position: 3, name: p.title, item: `/blog/${params.slug}` },
          ],
        }),
      },
    ];
    if (faqs) {
      scripts.push({
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
      });
    }
    return {
      meta: [
        { title: `${p.title} — Wallet Recovery Agent` },
        { name: "description", content: desc },
        { property: "og:title", content: p.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
        { property: "og:image", content: "/og-image.png" },
        { name: "twitter:image", content: "/og-image.png" },
        { property: "article:published_time", content: p.created_at },
        { property: "article:modified_time", content: p.updated_at },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts,
    };
  },
  component: BlogPost,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center font-mono">
        <h1 className="text-3xl text-primary text-glow">&gt; intel_not_found.txt</h1>
        <p className="mt-4 text-muted-foreground">This dispatch has been redacted or moved.</p>
        <Link to="/blog" className="mt-6 inline-block text-primary underline">
          [ back to intel ]
        </Link>
      </div>
    </div>
  ),
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  const readingMinutes = Math.max(1, Math.round(post.content.split(/\s+/).length / 220));
  const relatedRecover = post.category ? RELATED_RECOVER_BY_CATEGORY[post.category] : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <Link to="/blog" className="font-mono text-xs text-muted-foreground hover:text-primary">
          &lt; /intel
        </Link>

        <article className="mt-6">
          {post.category && (
            <span className="font-mono text-xs uppercase tracking-wider text-primary/70">
              // {post.category}
            </span>
          )}
          <h1 className="mt-2 font-mono text-3xl font-bold text-primary text-glow md:text-4xl">
            {post.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-4 font-mono text-xs text-muted-foreground">
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toISOString().slice(0, 10)}
            </time>
            <span>· {readingMinutes} min read</span>
          </div>

          <div className="prose prose-invert mt-8 max-w-none prose-headings:font-mono prose-headings:text-primary prose-h2:text-glow-soft prose-a:text-primary prose-strong:text-foreground prose-code:text-primary prose-code:bg-card prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </article>

        {relatedRecover ? (
          <div className="mt-12 rounded border border-border/60 bg-card/60 p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-primary/70">// related service</p>
            <p className="mt-2 font-mono text-primary">&gt; {relatedRecover.label}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Need this handled, not just explained? Our operatives specialize in exactly this scenario.
            </p>
            <a
              href={`/recover/${relatedRecover.slug}`}
              className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-primary hover:text-glow"
            >
              [ open service page ] <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        ) : null}

        <div className="mt-8 rounded border border-primary/60 bg-card/60 p-6">
          <p className="font-mono text-sm text-primary text-glow">&gt; ready_to_talk.sh</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Free assessment. No plaintext seed required. No recovery, no fee.
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
