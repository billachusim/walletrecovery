import { createFileRoute } from "@tanstack/react-router";
import { RecoverPage, buildRecoverHead } from "@/components/RecoverPage";

const slug = "coinbase";
const h1 = "Coinbase Account Recovery";
const title =
  "Coinbase Account Recovery — Locked Out, 2FA Lost, Wrong-Chain Deposits | Wallet Recovery Agent";
const description =
  "Locked out of Coinbase? 2FA gone after a phone swap? Sent tokens on the wrong network? We handle Coinbase.com account recovery, wrong-chain sweeps, and Coinbase Wallet self-custody recovery. No recovery, no fee.";

const faqs = [
  {
    q: "How long does Coinbase account recovery take?",
    a: "The mandatory security wait after a 2FA reset is 24–72 hours. Full ID-verified recovery for complex cases (email compromise, name change, old country) runs 2–6 weeks. Wrong-chain deposit recoveries take 4–12 weeks when Coinbase accepts them.",
  },
  {
    q: "Coinbase support closed my ticket twice with the same boilerplate. Now what?",
    a: "That's the exact point to escalate. We package the case with a legal-grade evidence bundle (login-alert timestamps, tx hashes, ID history) and route it through channels support agents can't override — sometimes through partner counsel where the account is entangled with SIM-swap or identity fraud.",
  },
  {
    q: "I sent USDT to my Coinbase address on BSC instead of Ethereum. Is it gone?",
    a: "Not gone. Coinbase custodies the private key for that deposit address on every EVM chain. They will sometimes sweep it for supported tokens (5% fee, $100 minimum, 4–12 weeks). If they decline, it becomes a private-key extraction problem — we have partner attorneys who, in some jurisdictions, can compel a signed transaction from a custodian for provable-owner funds.",
  },
  {
    q: "Does Coinbase have a seed phrase for my Coinbase.com account?",
    a: "No. Only Coinbase Wallet (self-custody) uses a seed phrase. Anyone asking for a seed phrase for a Coinbase.com custodial account is a scammer. Close the tab.",
  },
  {
    q: "I'm using Coinbase Wallet (the self-custody one) and lost the password. Help?",
    a: "That's a wallet-recovery problem, not a support ticket. If you have the 12-word phrase, reinstall the app and restore. If you have the phrase but forgot a custom 25th-word passphrase, we run GPU-accelerated dictionary attacks. If the phrase is partial or lost, see our seed-phrase recovery service.",
  },
  {
    q: "Cost?",
    a: "Free assessment. Success-only fee, typically 15–20% of recovered value. No recovery, no fee. We never ask for your full seed phrase in plaintext.",
  },
];

export const Route = createFileRoute("/recover/coinbase")({
  head: () => buildRecoverHead({ slug, title, description, h1, faqs }),
  component: () => (
    <RecoverPage
      slug={slug}
      crumbTitle={h1}
      kicker="target_type: coinbase"
      h1={h1}
      intro="Coinbase recovery is five different problems in a trench coat: account lockouts, missing withdrawals, wrong-chain deposits, unsupported token deposits, and Coinbase Wallet self-custody. Each has a different playbook — get the diagnosis right or you'll spend weeks in the wrong queue."
      sections={[
        {
          heading: "1. locked out of coinbase.com",
          body:
            "Standard path first: coinbase.com/signin → Forgot password → Try another way → Account recovery. Expect a 24–72h mandatory security wait after any 2FA reset. Have ready: government ID, selfie, last 4 digits of a linked payment method, access to the original signup email.\n\nWhen it fails — email hijacked, ID loop, SIM swap, name change, old country — that's an escalation case. We document, package, and route through channels the front-line queue can't reach.",
        },
        {
          heading: "2. unauthorized withdrawals — freeze first, ask later",
          body:
            "If you see withdrawals you didn't make: stop everything. Do not log in from the same device.\n\n1. From a different device on a different network, freeze the account via Settings → Security → Lock account.\n2. File a police report — Coinbase's fraud team requires a case number for escalation.\n3. Contact any linked bank; ACH pulls can sometimes be reversed within 60 days.\n4. Preserve every notification, SMS, and login-alert timestamp. Do not delete anything.\n\nWhat you say in the first 72 hours shapes the entire investigation. Talk to an operative before you send Coinbase a second message.",
        },
        {
          heading: "3. wrong-chain deposits (the expensive mistake)",
          body:
            "You picked BEP-20 on Binance when Coinbase gave you an Ethereum address. Funds show sent, nothing arrives. The tokens are not lost — they're sitting at your Coinbase-generated address on the wrong EVM chain.\n\nCoinbase custodies the key. They will sometimes sweep for a short list of supported networks + tokens (5% fee, $100 minimum, 4–12 weeks). Unsupported chains are declined outright.\n\nDO NOT send more funds to test. If Coinbase declines, it becomes a private-key extraction problem — partner counsel can, in some jurisdictions, compel a signed transaction from a custodian for provable-owner funds.",
        },
        {
          heading: "4. coinbase wallet is a different product",
          body:
            "Coinbase Wallet (the standalone app with a 12-word seed phrase) is self-custody. Coinbase support cannot help. Password lost, phrase partial, device bricked — that's a wallet-recovery workflow, not a support ticket.\n\n· Have the phrase, forgot the password → reinstall and restore.\n· Have the phrase, forgot a custom passphrase (25th word) → dictionary attack.\n· Phrase partial (10 of 12 words) → BIP-39 checksum reconstruction.\n· Phone bricked, no backup → device forensics.",
        },
        {
          heading: "what coinbase will never do",
          body:
            "If you see any of these, it's a scam:\n\n· Ask for your seed phrase (Coinbase.com doesn't have one for you).\n· Ask you to sync your wallet with a support agent.\n· Send a WalletConnect QR code.\n· DM you first on Telegram, WhatsApp, Discord, or X.\n· Offer to reverse a blockchain transaction for a fee.\n\nPublic blockchain transactions are irreversible by design. Every service promising to reverse one is a scam. What can be recovered is access to a wallet you already own — never funds you sent to a third party.",
        },
        {
          heading: "what to do right now",
          body:
            "1. Diagnose which of the five problems you actually have (assessment covers this in 3 minutes).\n2. If it's suspected compromise: freeze the account from a clean device before anything else.\n3. Preserve evidence — screenshots, timestamps, tx hashes.\n4. Open a case. Free. Private terminal. No plaintext seed ever required.",
        },
      ]}
      faqs={faqs}
    />
  ),
});
