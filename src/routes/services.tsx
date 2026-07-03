import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Shield, Lock, FileSearch, Smartphone, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const serviceSchemas = [
  { name: "Password Recovery", description: "GPU-accelerated password recovery on encrypted crypto wallet files. wallet.dat, keystore, MetaMask, Trust Wallet, Electrum." },
  { name: "Seed Phrase Reconstruction", description: "BIP-39 partial seed phrase recovery for 12/18/24-word phrases with checksum-based cryptographic search." },
  { name: "Hardware Wallet Recovery", description: "Ledger, Trezor, KeepKey PIN and firmware recovery with lab-based chain of custody." },
  { name: "Damaged Device Recovery", description: "Forensic recovery from corrupted drives, phones, and physically damaged storage." },
];

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Crypto Wallet Recovery Services — Seed, Password, Hardware, Exchange | Wallet Recovery Agent" },
      { name: "description", content: "Full-service cryptocurrency wallet recovery: seed phrase reconstruction, password brute-force, Ledger/Trezor hardware wallet recovery, corrupted file repair, exchange lockout support. No recovery, no fee." },
      { property: "og:title", content: "Crypto Wallet Recovery Services | Wallet Recovery Agent" },
      { property: "og:description", content: "Seed, password, hardware, exchange — every recovery service, one operative crew. No recovery, no fee." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: serviceSchemas.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: s.name,
              description: s.description,
              provider: { "@type": "Organization", name: "Wallet Recovery Agent" },
            },
          })),
        }),
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Our Recovery Services</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We specialize in recovering lost cryptocurrency wallets across every scenario. Each case is handled with strict confidentiality and a no-recovery, no-fee guarantee.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <ServiceDetail
            icon={<Shield className="h-10 w-10" />}
            title="Password Recovery"
            description="If you remember part of your wallet password or have hints about what you might have used, our tools can perform intelligent brute-force attacks to recover access."
            features={[
              "Dictionary attacks with custom wordlists",
              "Pattern-based password generation",
              "Partial-password brute forcing",
              "Multi-GPU acceleration for speed",
            ]}
          />
          <ServiceDetail
            icon={<Lock className="h-10 w-10" />}
            title="Recovery Phrase Reconstruction"
            description="Missing one or two words from your 12, 18, or 24-word recovery phrase? Using the checksum and known words, we can reconstruct the complete phrase."
            features={[
              "BIP-39 phrase validation",
              "Checksum-based reconstruction",
              "Multi-language wordlist support",
              "Hardware wallet compatibility",
            ]}
          />
          <ServiceDetail
            icon={<FileSearch className="h-10 w-10" />}
            title="Corrupted File Recovery"
            description="Wallet files can become corrupted due to disk errors, software bugs, or incomplete writes. We use forensic techniques to extract keys from damaged files."
            features={[
              "Raw disk sector scanning",
              "File carver for wallet formats",
              "Backup and temp file recovery",
              "Wallet.dat repair and extraction",
            ]}
          />
          <ServiceDetail
            icon={<Smartphone className="h-10 w-10" />}
            title="Damaged Device Recovery"
            description="Phones, hard drives, and SSDs that won't boot may still contain recoverable wallet data. We perform physical and logical data recovery."
            features={[
              "Damaged drive imaging",
              "Mobile device forensic extraction",
              "SSD TRIM-aware recovery",
              "Secure chain of custody handling",
            ]}
          />
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/assessment"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get Free Assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-border/50 px-4 py-10">
        <div className="mx-auto max-w-7xl text-center font-mono text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} wallet_recovery_agent // your operative on the inside
        </div>
      </footer>
    </div>
  );
}

function ServiceDetail({
  icon,
  title,
  description,
  features,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-8">
      <div className="text-primary">{icon}</div>
      <h3 className="mt-4 text-xl font-semibold text-card-foreground">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
