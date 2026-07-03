import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Briefcase, FileText, MessageSquare, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      return data;
    },
  });

  const { data: assessments } = useQuery({
    queryKey: ["my-assessments"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const assessmentCount = assessments?.length ?? 0;

  const statusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "quoted": return "bg-blue-100 text-blue-800";
      case "declined": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {profile?.full_name || session?.user?.email?.split("@")[0] || "Customer"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your recovery assessments and track case progress from your dashboard.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Assessments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assessmentCount}</div>
              <p className="text-xs text-muted-foreground">
                {assessmentCount === 1 ? "Assessment" : "Assessments"} submitted
              </p>
              <Link to="/assessment" className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline">
                New Assessment <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Cases in progress</p>
              <span className="mt-4 inline-flex items-center text-sm text-muted-foreground">
                Coming soon <ArrowRight className="ml-1 h-3 w-3" />
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
              <span className="mt-4 inline-flex items-center text-sm text-muted-foreground">
                Coming soon <ArrowRight className="ml-1 h-3 w-3" />
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-foreground">My Assessments</h2>
          {assessments && assessments.length > 0 ? (
            <div className="mt-4 space-y-3">
              {assessments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{a.wallet_type}</p>
                      <p className="text-sm text-muted-foreground">{a.loss_reason}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(a.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={statusColor(a.status)}>{a.status}</Badge>
                    {a.recovery_probability !== null && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.recovery_probability}% recovery chance
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
              No assessments yet. Start by submitting a free recovery assessment.
            </div>
          )}
          <div className="mt-4">
            <Link
              to="/assessment"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start Free Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
