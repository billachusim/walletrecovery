import { createFileRoute } from "@tanstack/react-router";
import { RecoverPage, buildRecoverHead } from "@/components/RecoverPage";

const slug = "seed-phrase";
const h1 = "Seed Phrase Recovery";
const title = "Seed Phrase Recovery — Reconstruct Lost BIP-39 Words | Wallet Recovery Agent";
const description =
  "Lost part of your 12 or 24-word seed phrase? Recovery Agent reconstructs partial BIP-39 seed phrases using cryptographic search. No plaintext seed required to start.";

const faqs = [
  { q: "Can you recover a wallet if I only have 11 of 12 words?", a: "Yes — a single missing BIP-39 word is a small search space and is often recoverable within hours, given a known derivation path and one target address." },
  { q: "What if I have 10 words or fewer?", a: "Recovery is still possible but the cost grows exponentially. We assess feasibility case-by-case and only quote you when odds are meaningful." },
  { q: "Do I need to give you my full seed?", a: "No — never. We will refuse it. We only need the words you do remember, their approximate positions, and a target address to search against." },
  { q: "What about custom/25th-word BIP-39 passphrases?", a: "We handle passphrase (extended seed) reconstruction if you can provide hints — length, character sets, and any patterns you may have used." },
  { q: "How much does it cost?", a: "Free assessment. If recovery is possible, we quote a success-only fee (typically 15–20% of returned assets). No recovery, no fee." },
];

export const Route = createFileRoute("/recover/seed-phrase")({
  head: () => buildRecoverHead({ slug, title, description, h1, faqs }),
  component: () => (
    <RecoverPage
      slug={slug}
      crumbTitle={h1}
      kicker="target_type: bip-39"
      h1={h1}
      intro="You wrote down 12 or 24 words. One got smudged. One got torn off. One you can't read your own handwriting on. That's not the end of the wallet — it's a math problem. And math problems have solutions."
      sections={[
        {
          heading: "how partial seed recovery works",
          body:
            "BIP-39 seed phrases are drawn from a fixed 2048-word wordlist. When you're missing a small number of words, the total search space is bounded — 2048 possibilities per missing word. For a single missing word we test each candidate against your target address; for two missing words, ~4 million combinations. Modern GPUs churn through these in minutes to hours.\n\nWhat we need from you:\n- The words you DO have, in their positions (approximate is fine).\n- One address you know belongs to that wallet.\n- The wallet software that generated it (this tells us the derivation path).",
        },
        {
          heading: "what we will never do",
          body:
            "We will not ask for your full seed phrase. We will not ask for private keys. If any recovery service does, it is a scam — end the conversation immediately.\n\nOur workflow is designed so that even after successful reconstruction, our engineers do not see the plaintext seed unless you explicitly authorize it. You retain sovereignty.",
        },
        {
          heading: "common seed-loss scenarios we handle",
          body:
            "· Fire, flood, or physical damage to written backups\n· Faded ink or smudged handwriting (partial words visible)\n· Metal backup plate corrosion (Cryptosteel, Billfodl, etc.)\n· Photographed seed that got compressed / cropped\n· Migration from an old wallet where words got shuffled\n· Passphrase (25th word) forgotten but original 24 intact",
        },
        {
          heading: "timelines and cost",
          body:
            "Single missing word: usually resolved in 2–24 hours.\nTwo to three missing words: 1–5 days depending on GPU pool.\nCorrupted seed with 4+ unknowns: assessed individually.\n\nAll pricing is success-only. You pay a percentage of the recovered funds; if we recover nothing, you owe nothing.",
        },
      ]}
      faqs={faqs}
    />
  ),
});
