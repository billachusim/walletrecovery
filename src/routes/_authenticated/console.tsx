import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/_authenticated/console")({
  head: () => ({
    meta: [
      { title: "Operator Console — Wallet Recovery Agent" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ConsoleLayout,
});

function ConsoleLayout() {
  const location = useLocation();

  const { data: roles, isLoading } = useQuery({
    queryKey: ["my-roles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [] as string[];
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      return (data ?? []).map((r) => r.role as string);
    },
  });

  const isStaff = roles?.includes("staff") || roles?.includes("admin");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-10 font-mono text-sm text-muted-foreground">
          &gt; authenticating operator...
        </main>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 font-mono text-2xl font-bold text-primary">access denied</h1>
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            &gt; role required: staff | admin
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            This is the operator console. If you're looking for your recovery cases, head to your{" "}
            <Link to="/dashboard" className="text-primary underline">dashboard</Link>.
          </p>
        </main>
      </div>
    );
  }

  const path = location.pathname;
  const tabCls = (active: boolean) =>
    `font-mono text-sm px-3 py-1.5 border-b-2 transition-colors ${
      active
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-primary"
    }`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="font-mono text-2xl font-bold text-primary text-glow">
            &gt; operator_console
          </h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            triage assessments, manage active cases
          </p>
        </div>

        <div className="mb-6 flex gap-2 border-b border-border">
          <Link to="/console" className={tabCls(path === "/console")}>
            /assessments
          </Link>
          <Link to="/console/cases" className={tabCls(path.startsWith("/console/cases") || path.startsWith("/console/case"))}>
            /cases
          </Link>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
