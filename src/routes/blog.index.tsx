import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  created_at: string;
};

const postsQuery = queryOptions({
  queryKey: ["blog", "posts", "all"],
  queryFn: async (): Promise<Post[]> => {
    const { data, error } = await supabase
      .from("articles")
      .select("id,title,slug,excerpt,category,created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Post[];
  },
});

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  head: () => ({
    meta: [
      { title: "Intel — Wallet Recovery Guides, Case Files & Scam Alerts" },
      {
        name: "description",
        content:
          "Field notes from wallet recovery operations: seed phrase reconstruction, hardware wallet unlocks, scam alerts, and honest case files. Read the intel before you hire anyone.",
      },
      { property: "og:title", content: "Intel — Wallet Recovery Agent" },
      { property: "og:description", content: "Field notes on wallet recovery: guides, case files, scam alerts." },
      { property: "og:url", content: "/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data: posts } = useSuspenseQuery(postsQuery);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary/70">── field notes ──</p>
        <h1 className="mt-3 font-mono text-4xl font-bold text-primary text-glow md:text-5xl">
          &gt; intel/<span className="terminal-caret ml-1" aria-hidden="true" />
        </h1>
        <p className="mt-4 max-w-2xl text-foreground/80">
          Recovery guides, case files, and scam alerts from the operatives. Read before you
          hire anyone — including us.
        </p>

        {posts.length === 0 ? (
          <div className="mt-16 rounded border border-border/60 bg-card/50 p-8 text-center font-mono text-sm text-muted-foreground">
            &gt; no_intel_yet.txt — check back soon.
          </div>
        ) : (
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {posts.map((p) => (
              <li key={p.id}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group block h-full rounded border border-border/60 bg-card/60 p-6 transition-colors hover:border-primary/60 hover:bg-card"
                >
                  {p.category && (
                    <span className="font-mono text-xs uppercase tracking-wider text-primary/70">
                      // {p.category}
                    </span>
                  )}
                  <h2 className="mt-2 font-mono text-lg text-primary group-hover:text-glow">
                    {p.title}
                  </h2>
                  {p.excerpt && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between font-mono text-xs text-muted-foreground">
                    <time dateTime={p.created_at}>
                      {new Date(p.created_at).toISOString().slice(0, 10)}
                    </time>
                    <span className="text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
