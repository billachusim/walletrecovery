import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/console/cases")({
  component: CasesList,
});

function CasesList() {
  const { data: cases, isLoading } = useQuery({
    queryKey: ["console-cases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("id, title, wallet_type, status, estimated_value, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) return <p className="font-mono text-sm text-muted-foreground">&gt; loading cases...</p>;
  if (!cases || cases.length === 0) {
    return (
      <div className="rounded border border-border bg-card p-10 text-center font-mono text-sm text-muted-foreground">
        &gt; no active cases yet. convert an assessment to open one.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cases.map((c) => (
        <Link
          key={c.id}
          to="/console/case/$id"
          params={{ id: c.id }}
          className="flex items-center justify-between rounded border border-border bg-card p-4 transition-colors hover:border-primary/60"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-primary">
                  {String(c.id).slice(0, 8).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-card-foreground">{c.title}</span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground">
                {new Date(c.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="border border-primary/30 bg-primary/10 font-mono text-[10px] text-primary">
              {c.status}
            </Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Link>
      ))}
    </div>
  );
}
