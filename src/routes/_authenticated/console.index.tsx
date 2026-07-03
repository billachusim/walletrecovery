import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/console/")({
  component: AssessmentQueue,
});

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  quoted: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  converted: "bg-primary/10 text-primary border-primary/30",
  declined: "bg-red-500/10 text-red-400 border-red-500/30",
};

function AssessmentQueue() {
  const { data: assessments, isLoading } = useQuery({
    queryKey: ["console-assessments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessments")
        .select("id, wallet_type, loss_reason, status, guest_email, estimated_value, recovery_probability, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return <p className="font-mono text-sm text-muted-foreground">&gt; loading queue...</p>;
  }

  if (!assessments || assessments.length === 0) {
    return (
      <div className="rounded border border-border bg-card p-10 text-center font-mono text-sm text-muted-foreground">
        &gt; queue empty. no assessments submitted yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="font-mono text-xs text-muted-foreground">
        {assessments.length} assessment{assessments.length === 1 ? "" : "s"} in queue
      </div>
      {assessments.map((a) => (
        <Link
          key={a.id}
          to="/console/assessment/$id"
          params={{ id: a.id }}
          className="flex items-center justify-between rounded border border-border bg-card p-4 transition-colors hover:border-primary/60"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-primary">
                  {String(a.id).slice(0, 8).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-card-foreground">
                  {a.wallet_type}
                </span>
                {a.guest_email && (
                  <span className="rounded border border-accent/40 bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                    guest
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {a.loss_reason} · {a.guest_email ?? "signed-in user"}
              </p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                {new Date(a.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div>
              <Badge className={`${STATUS_STYLES[a.status] ?? "bg-muted"} border font-mono text-[10px]`}>
                {a.status}
              </Badge>
              {a.recovery_probability !== null && (
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  {a.recovery_probability}% chance
                </p>
              )}
              {a.estimated_value !== null && (
                <p className="font-mono text-[10px] text-muted-foreground">
                  ~${Number(a.estimated_value).toLocaleString()}
                </p>
              )}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Link>
      ))}
    </div>
  );
}
