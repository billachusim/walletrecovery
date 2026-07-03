import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/services", changefreq: "monthly", priority: "0.9" },
          { path: "/pricing", changefreq: "monthly", priority: "0.8" },
          { path: "/faq", changefreq: "monthly", priority: "0.7" },
          { path: "/about", changefreq: "monthly", priority: "0.7" },
          
          { path: "/assessment", changefreq: "monthly", priority: "0.9" },
          { path: "/blog", changefreq: "weekly", priority: "0.9" },
          { path: "/recover/seed-phrase", changefreq: "monthly", priority: "0.9" },
          { path: "/recover/forgotten-password", changefreq: "monthly", priority: "0.9" },
          { path: "/recover/hardware-wallet", changefreq: "monthly", priority: "0.9" },
          { path: "/recover/metamask", changefreq: "monthly", priority: "0.9" },
          { path: "/recover/trust-wallet", changefreq: "monthly", priority: "0.9" },
          { path: "/recover/exchange-lockout", changefreq: "monthly", priority: "0.9" },
        ];

        let postEntries: SitemapEntry[] = [];
        try {
          const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
          );
          const { data } = await supabase
            .from("articles")
            .select("slug, updated_at")
            .eq("published", true);
          postEntries = (data ?? []).map((p) => ({
            path: `/blog/${p.slug}`,
            lastmod: p.updated_at?.slice(0, 10),
            changefreq: "monthly",
            priority: "0.7",
          }));
        } catch {
          postEntries = [];
        }

        const entries = [...staticEntries, ...postEntries];
        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
