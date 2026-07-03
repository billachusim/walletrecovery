import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Shield, Lock, FileSearch, MessageSquare, ArrowRight, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wallet Recovery — Secure Crypto Asset Recovery" },
      { name: "description", content: "Professional cryptocurrency wallet recovery services. Free assessment. No recovery, no fee." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Recover Your Lost Cryptocurrency
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Millions of people have lost access to their crypto wallets. We specialize in recovering
            lost passwords, corrupted files, and incomplete recovery phrases. Free assessment.
            <span className="font-semibold text-foreground"> No recovery, no fee.</span>
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/assessment"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Free Recovery Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
            >
              Sign In to Your Account
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Free Assessment
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              No Recovery, No Fee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Secure & Confidential
            </span>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-border bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">How We Can Help</h2>
            <p className="mt-4 text-muted-foreground">Professional recovery services for every type of wallet loss</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              icon={<Shield className="h-8 w-8" />}
              title="Password Recovery"
              description="Brute-force attacks when you remember part of your password or have password hints."
            />
            <ServiceCard
              icon={<FileSearch className="h-8 w-8" />}
              title="Corrupted Files"
              description="Recovery from damaged or corrupted wallet files on old hard drives and devices."
            />
            <ServiceCard
              icon={<Lock className="h-8 w-8" />}
              title="Partial Phrases"
              description="Reconstruct incomplete recovery phrases when you have 10–11 out of 12 words."
            />
            <ServiceCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="Device Damage"
              description="Data recovery from damaged phones, computers, and other storage devices."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">How It Works</h2>
            <p className="mt-4 text-muted-foreground">A transparent, trust-first process from assessment to recovery</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              step="1"
              title="Free Assessment"
              description="Submit details about your wallet loss. We analyze the situation and estimate your recovery probability."
            />
            <StepCard
              step="2"
              title="Forensic Analysis"
              description="If recovery is viable, we perform a detailed forensic analysis and provide a transparent fee quote."
            />
            <StepCard
              step="3"
              title="Secure Recovery"
              description="We attempt recovery using proven techniques. You only pay a success fee if we recover your assets."
            />
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="border-t border-border bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Why Trust Us</h2>
          <div className="mt-10 grid gap-6 text-left md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-card-foreground">No Recovery, No Fee</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We only charge a percentage of successfully recovered funds. If we cannot recover your wallet, you owe nothing.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-card-foreground">Strict Privacy</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your data and wallet information are handled with the highest confidentiality. We never share details with third parties.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-card-foreground">Signed Agreements</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Every case begins with a signed legal agreement that clearly defines ownership, fees, and our obligations.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-card-foreground">Chain of Custody</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Physical devices are logged and tracked throughout the recovery process with full audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl bg-primary px-6 py-16 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight">Don't Give Up on Your Assets</h2>
          <p className="mt-4 text-primary-foreground/80">
            Even a few high-value recoveries can change everything. Start with a free, no-obligation assessment today.
          </p>
          <Link
            to="/assessment"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-primary-foreground px-6 py-3 text-base font-medium text-primary transition-colors hover:bg-primary-foreground/90"
          >
            Get Free Assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Wallet Recovery. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/services" className="hover:text-foreground">Services</Link>
              <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
              <Link to="/faq" className="hover:text-foreground">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
      <div className="text-primary">{icon}</div>
      <h3 className="mt-4 font-semibold text-card-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="relative rounded-lg border border-border bg-card p-6">
      <span className="absolute -top-3 left-6 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {step}
      </span>
      <h3 className="mt-2 font-semibold text-card-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
