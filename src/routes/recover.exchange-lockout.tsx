import { createFileRoute } from "@tanstack/react-router";
import { RecoverPage, buildRecoverHead } from "@/components/RecoverPage";

const slug = "exchange-lockout";
const h1 = "Exchange Account Lockout Recovery";
const title = "Locked Out of Coinbase, Binance, Kraken? Exchange Account Recovery | Wallet Recovery Agent";
const description =
  "Locked out of your Coinbase, Binance, Kraken, or other exchange account? Recovery Agent handles documented escalation, KYC support, and lost-2FA recovery. No recovery, no fee.";

const faqs = [
  { q: "Can you get me back into my Binance account?", a: "We don't hack exchanges. We assemble the strongest possible documentation package for the exchange's account-recovery team and escalate through legitimate channels. Success rates are high when the account is genuinely yours." },
  { q: "What if I lost my 2FA?", a: "Every major exchange has a documented 2FA-reset procedure. It's slow and requires identity verification. We package the request correctly the first time so it doesn't get bounced." },
  { q: "My KYC was rejected. What now?", a: "This is usually a paperwork problem — mismatched name spelling, expired ID, bad photo. We audit your submission and coach you through resubmission." },
  { q: "The exchange says my account was frozen for suspicious activity.", a: "This requires a formal appeal, often with source-of-funds documentation. We help build the evidence file. If the freeze is regulatory (sanctions, court order), we're honest that we can't help." },
  { q: "Cost?", a: "Free assessment. Flat-fee or success-based depending on complexity, agreed upfront in writing." },
];

export const Route = createFileRoute("/recover/exchange-lockout")({
  head: () => buildRecoverHead({ slug, title, description, h1, faqs }),
  component: () => (
    <RecoverPage
      slug={slug}
      crumbTitle={h1}
      kicker="target_type: exchange"
      h1={h1}
      intro="Losing access to an exchange account is a paperwork problem, not a cryptography problem. The funds are there. The exchange has them. Your job — with our help — is to prove to them, in the format they expect, that you are you. We've done this hundreds of times."
      sections={[
        {
          heading: "exchanges we work with",
          body:
            "Coinbase, Binance, Binance.US, Kraken, Bitstamp, Bitfinex, Gemini, KuCoin, OKX, Bybit, Crypto.com, and 30+ smaller exchanges.\n\nWe do NOT work with defunct or absconded exchanges (Celsius, FTX, Voyager); those are legal cases, not recovery cases.",
        },
        {
          heading: "common lockout scenarios",
          body:
            "· Lost 2FA (Google Authenticator, Authy, hardware key)\n· Forgotten password AND recovery email compromised\n· KYC rejection loop — resubmission after resubmission\n· Account frozen for \"suspicious activity\" or unclear source-of-funds\n· Inherited account (deceased relative) — this is a legal-plus-support case\n· SIM-swap: attacker changed your number, you need to recover control",
        },
        {
          heading: "how we work",
          body:
            "· Free triage: we assess whether this is a recoverable case or not, honestly.\n· Documentation build: we compile every piece of evidence the exchange will ask for — ID, proof of address, transaction history, device fingerprints, past communications.\n· Submission: we help you file the recovery request through official channels, correctly, the first time.\n· Escalation: if the first response is a template refusal, we escalate through higher-tier support and, where appropriate, legal or regulatory channels.\n· Follow-through: we stay on the case until it's resolved or we've exhausted legitimate paths.",
        },
        {
          heading: "what we don't do",
          body:
            "· We don't bribe exchange employees.\n· We don't fake documents.\n· We don't hack.\n· We don't take cases we can't win — we tell you upfront if it's not worth trying.",
        },
      ]}
      faqs={faqs}
    />
  ),
});
