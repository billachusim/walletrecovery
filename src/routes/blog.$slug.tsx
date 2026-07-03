import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

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
    return {
      meta: [
        { title: `${p.title} — Wallet Recovery Agent` },
        { name: "description", content: desc },
        { property: "og:title", content: p.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
        { property: "article:published_time", content: p.created_at },
        { property: "article:modified_time", content: p.updated_at },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: [
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
            publisher: {
              "@type": "Organization",
              name: "Wallet Recovery Agent",
            },
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
      ],
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

        <div className="mt-12 rounded border border-primary/60 bg-card/60 p-6">
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
