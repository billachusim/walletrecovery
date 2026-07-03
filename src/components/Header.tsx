import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Terminal, X } from "lucide-react";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { email: data.user.email } : null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ? { email: session.user.email } : null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
    setUser(null);
  };

  const linkCls = "text-sm font-mono text-muted-foreground hover:text-primary transition-colors";

  return (
    <header className="border-b border-border/60 bg-background/70 backdrop-blur relative z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-mono text-lg font-bold tracking-tight text-primary text-glow">
          <Terminal className="h-4 w-4" />
          <span>wallet_recovery_agent</span>
          <span className="terminal-caret" aria-hidden="true" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/services" className={linkCls}>// services</Link>
          <Link to="/pricing" className={linkCls}>// pricing</Link>
          <Link to="/blog" className={linkCls}>&gt; intel/</Link>
          <Link to="/faq" className={linkCls}>// faq</Link>
          <Link to="/about" className={linkCls}>// about</Link>
          <Link to="/assessment" className="rounded border border-primary/60 bg-primary/10 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
            [ talk to agent ]
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className={linkCls}>// console</Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="font-mono">
                <LogOut className="mr-1 h-3.5 w-3.5" /> exit
              </Button>
            </>
          ) : (
            <Link to="/auth" className={linkCls}>~/login</Link>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-primary">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/60 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 font-mono">
            <Link to="/services" className={linkCls} onClick={() => setMobileOpen(false)}>// services</Link>
            <Link to="/pricing" className={linkCls} onClick={() => setMobileOpen(false)}>// pricing</Link>
            <Link to="/blog" className={linkCls} onClick={() => setMobileOpen(false)}>&gt; intel/</Link>
            <Link to="/faq" className={linkCls} onClick={() => setMobileOpen(false)}>// faq</Link>
            <Link to="/about" className={linkCls} onClick={() => setMobileOpen(false)}>// about</Link>
            <Link to="/assessment" className={linkCls} onClick={() => setMobileOpen(false)}>[ talk to agent ]</Link>
            {user ? (
              <>
                <Link to="/dashboard" className={linkCls} onClick={() => setMobileOpen(false)}>// console</Link>
                <button onClick={handleSignOut} className={`${linkCls} text-left`}>exit</button>
              </>
            ) : (
              <Link to="/auth" className={linkCls} onClick={() => setMobileOpen(false)}>~/login</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
