import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Wallet Recovery FAQ | Wallet Recovery Agent" },
      { name: "description", content: "Answers on crypto wallet recovery: what we can recover, cost, timelines, and how we keep your keys safe. No recovery, no fee." },
      { property: "og:title", content: "Wallet Recovery FAQ | Wallet Recovery Agent" },
      { property: "og:description", content: "How wallet recovery works, what it costs, and how we protect your keys." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  {
    question: "What types of wallets can you recover?",
    answer:
      "We support Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), Ripple (XRP), Cardano (ADA), Solana (SOL), and most major cryptocurrencies. We also work with hardware wallets like Ledger and Trezor, as well as multi-currency software wallets.",
  },
  {
    question: "Is there really no fee if recovery fails?",
    answer:
      "Correct. We operate on a strict no-recovery, no-fee basis. You only pay a percentage of the successfully recovered funds. This aligns our incentives with yours — we only get paid when you get your assets back.",
  },
  {
    question: "How long does recovery take?",
    answer:
      "It depends on the complexity of your case. Simple password recovery might take a few hours to days. Complex cases involving damaged hardware or partial phrases can take weeks. We provide an estimated timeline during your free assessment.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use encrypted storage, strict access controls, and signed legal agreements. Your wallet data is never shared with third parties. For physical devices, we maintain a full chain of custody with audit trails.",
  },
  {
    question: "Can you recover a wallet if I have no recovery phrase and no password?",
    answer:
      "Unfortunately, no. If you have zero information — no password hints, no partial phrase, no backup file — recovery is mathematically impossible. We only take cases where there is a viable path to recovery.",
  },
  {
    question: "Do I need to send you my device?",
    answer:
      "Only for cases involving damaged hardware or corrupted storage. For password or phrase recovery, you can often provide the necessary files digitally. When physical devices are required, we provide prepaid shipping labels and track every package.",
  },
  {
    question: "What percentage do you charge?",
    answer:
      "Our success fee ranges from 10% to 30% of recovered funds, depending on the complexity of the case and the techniques required. We provide a transparent quote during the free assessment phase.",
  },
  {
    question: "How do I track my case progress?",
    answer:
      "Once you submit an assessment and create an account, you can track your case status in real-time through your customer dashboard. You'll also receive email updates at every major milestone.",
  },
];

function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h1>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about our recovery process.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>

      <footer className="border-t border-border/50 px-4 py-10">
        <div className="mx-auto max-w-7xl text-center font-mono text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} wallet_recovery_agent // your operative on the inside
        </div>
      </footer>
    </div>
  );
}
