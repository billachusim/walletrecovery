import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const loadRole = async (uid: string) => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      const roles = (data ?? []).map((r) => r.role as string);
      setIsStaff(roles.includes("staff") || roles.includes("admin"));
    };
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email });
        loadRole(data.user.id);
      } else {
        setUser(null);
        setIsStaff(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
        loadRole(session.user.id);
      } else {
        setUser(null);
        setIsStaff(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
    setUser(null);
    setIsStaff(false);
  };

  const linkCls = "text-sm font-mono text-muted-foreground hover:text-primary transition-colors";

  return (
    <header className="border-b border-border/60 bg-background/70 backdrop-blur relative z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2 font-mono text-base font-bold tracking-tight text-primary text-glow sm:text-lg"
        >
          <LogoMark className="h-6 w-6 shrink-0 text-primary" />
          <span className="truncate">wallet_recovery_agent</span>
          <span className="terminal-caret shrink-0" aria-hidden="true" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/services" className={linkCls}>/services</Link>
          <Link to="/pricing" className={linkCls}>/pricing</Link>
          <Link to="/blog" className={linkCls}>/intel</Link>
          <Link to="/faq" className={linkCls}>/faq</Link>
          <Link to="/about" className={linkCls}>/about</Link>
          <Link to="/assessment" className="rounded border border-primary/60 bg-primary/10 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
            [ talk to agent ]
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className={linkCls}>/dashboard</Link>
              {isStaff && <Link to="/console" className={linkCls}>/console</Link>}
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="font-mono">
                <LogOut className="mr-1 h-3.5 w-3.5" /> exit
              </Button>
            </>
          ) : (
            <Link to="/auth" className={linkCls}>/login</Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-10 items-center justify-center rounded border border-primary/50 bg-primary/5 font-mono text-lg font-bold leading-none text-primary text-glow hover:bg-primary/15"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span aria-hidden="true">{mobileOpen ? ">" : "_"}</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/60 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 font-mono">
            <Link to="/services" className={linkCls} onClick={() => setMobileOpen(false)}>/services</Link>
            <Link to="/pricing" className={linkCls} onClick={() => setMobileOpen(false)}>/pricing</Link>
            <Link to="/blog" className={linkCls} onClick={() => setMobileOpen(false)}>/intel</Link>
            <Link to="/faq" className={linkCls} onClick={() => setMobileOpen(false)}>/faq</Link>
            <Link to="/about" className={linkCls} onClick={() => setMobileOpen(false)}>/about</Link>
            <Link to="/assessment" className={linkCls} onClick={() => setMobileOpen(false)}>[ talk to agent ]</Link>
            {user ? (
              <>
                <Link to="/dashboard" className={linkCls} onClick={() => setMobileOpen(false)}>/dashboard</Link>
                {isStaff && (
                  <Link to="/console" className={linkCls} onClick={() => setMobileOpen(false)}>/console</Link>
                )}
                <button onClick={handleSignOut} className={`${linkCls} text-left`}>exit</button>
              </>
            ) : (
              <Link to="/auth" className={linkCls} onClick={() => setMobileOpen(false)}>/login</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
