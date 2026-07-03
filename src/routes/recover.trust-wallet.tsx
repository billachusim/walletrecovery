import { createFileRoute } from "@tanstack/react-router";
import { RecoverPage, buildRecoverHead } from "@/components/RecoverPage";

const slug = "trust-wallet";
const h1 = "Trust Wallet Recovery";
const title = "Trust Wallet Recovery — Lost Seed, Forgotten Password | Wallet Recovery Agent";
const description =
  "Trust Wallet locked, wiped, or seed lost? Recovery Agent handles Trust Wallet vault recovery, mobile app forensics, and passphrase reconstruction. No recovery, no fee.";

const faqs = [
  { q: "I uninstalled Trust Wallet without backing up the seed — is it gone?", a: "Maybe not. On some Android versions, the encrypted keystore persists in app-data backups. On iOS, iCloud backups sometimes retain it. We'll check during free assessment." },
  { q: "I have the seed but forgot the app password.", a: "The seed IS your wallet — the app password is only a local convenience. Install Trust Wallet fresh on any device and restore with your seed. You don't need us for this." },
  { q: "I lost my phone. What can I do?", a: "If you have the seed phrase — nothing to worry about, restore anywhere. If you don't have the seed and can't get the phone back, contact us with the device model, carrier, and last known state." },
  { q: "Can you recover from a factory-reset phone?", a: "Sometimes. Depends on Android version, encryption state, and whether the device was ever rooted. iOS post-reset recovery is very rarely possible." },
  { q: "Cost?", a: "Free assessment. Success-only fee (typically 15–20%). No recovery, no fee." },
];

export const Route = createFileRoute("/recover/trust-wallet")({
  head: () => buildRecoverHead({ slug, title, description, h1, faqs }),
  component: () => (
    <RecoverPage
      slug={slug}
      crumbTitle={h1}
      kicker="target_type: trust wallet"
      h1={h1}
      intro="Trust Wallet stores everything on the device — that's the tradeoff for self-custody on mobile. When the phone dies, the app gets uninstalled, or the seed backup wasn't taken, the recovery path is mobile forensics, not a support ticket."
      sections={[
        {
          heading: "how Trust Wallet stores your keys",
          body:
            "Trust Wallet encrypts your seed with your app password and stores the ciphertext in the app's private data directory. On Android it's under /data/data/com.wallet.crypto.trustapp/. On iOS it's in the app's protected keystore.\n\nRecovery means getting that ciphertext off the device and running password/passphrase recovery against it — or, if the device is gone, reconstructing from backups.",
        },
        {
          heading: "android recovery paths",
          body:
            "· Device rooted → full extraction possible.\n· Device unrooted, app data backup enabled → often extractable via ADB or a Google account backup.\n· Device factory-reset with FBE encryption → very difficult, but not always impossible.\n· Uninstalled but device intact → app data may persist for weeks; act fast.",
        },
        {
          heading: "ios recovery paths",
          body:
            "· iTunes / Finder encrypted backup → we can attempt to extract from the backup with your Apple ID password.\n· iCloud backup → same, requires your credentials.\n· Physical device access → the iOS keystore is very hard to attack; we don't oversell here.\n· Factory-reset iPhone → essentially not recoverable.",
        },
        {
          heading: "the scam warning",
          body:
            "Trust Wallet users are the #1 target of \"recovery service\" scams on Telegram and X/Twitter. Rules:\n\n· No legitimate service will ever DM you first offering to recover your wallet.\n· No legitimate service asks for your seed phrase. Not us. Not anyone.\n· No legitimate service asks for an upfront fee to \"unlock\" or \"validate\" your wallet.\n\nIf someone breaks any of these rules, they are stealing from you. See /blog/how-wallet-recovery-really-works.",
        },
      ]}
      faqs={faqs}
    />
  ),
});
