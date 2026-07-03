import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — No Recovery, No Fee | Wallet Recovery Agent" },
      { name: "description", content: "Transparent success-based pricing for crypto wallet recovery. Free assessment. Pay a percentage only on recovery. No recovery, no fee." },
      { property: "og:title", content: "Wallet Recovery Pricing | Wallet Recovery Agent" },
      { property: "og:description", content: "Free assessment. No recovery, no fee. Success-based pricing." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-20">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Transparent Pricing</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We only succeed when you succeed. Our fee structure is designed to align our incentives with yours.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-8">
            <h3 className="text-lg font-semibold text-card-foreground">Free Assessment</h3>
            <p className="mt-2 text-3xl font-bold text-foreground">$0</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Submit your case details and receive an estimated recovery probability and recommended approach within 24–48 hours.
            </p>
            <ul className="mt-6 space-y-3">
              <PricingFeature text="Recovery probability estimate" />
              <PricingFeature text="Recommended recovery path" />
              <PricingFeature text="Transparent fee quote" />
              <PricingFeature text="No obligation" />
            </ul>
          </div>

          <div className="rounded-xl border-2 border-primary bg-primary/5 p-8">
            <div className="inline-flex rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              Success Based
            </div>
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">Recovery Fee</h3>
            <p className="mt-2 text-3xl font-bold text-foreground">10–30%</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Charged only if we successfully recover your wallet. The percentage depends on complexity, estimated value, and the techniques required.
            </p>
            <ul className="mt-6 space-y-3">
              <PricingFeature text="No upfront payment required" />
              <PricingFeature text="Signed agreement before work begins" />
              <PricingFeature text="Sliding scale based on recovery difficulty" />
              <PricingFeature text="No fee if recovery fails" />
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-border bg-muted/30 p-8">
          <h3 className="text-lg font-semibold text-foreground">Example Scenarios</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <ExampleCard value="$5,000" fee="$500–$1,000" rate="10–20%" />
            <ExampleCard value="$50,000" fee="$5,000–$10,000" rate="10–20%" />
            <ExampleCard value="$250,000" fee="$25,000–$62,500" rate="10–25%" />
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/assessment"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Free Assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-border px-4 py-10">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} wallet_recovery_agent // your operative on the inside
        </div>
      </footer>
    </div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-sm text-muted-foreground">
      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
      {text}
    </li>
  );
}

function ExampleCard({ value, fee, rate }: { value: string; fee: string; rate: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-center">
      <p className="text-sm text-muted-foreground">Wallet Value</p>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <div className="my-2 h-px bg-border" />
      <p className="text-sm text-muted-foreground">Recovery Fee</p>
      <p className="text-lg font-semibold text-foreground">{fee}</p>
      <p className="text-xs text-muted-foreground">{rate}</p>
    </div>
  );
}
