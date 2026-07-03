// Static mapping between /recover/* pages and blog posts for internal linking.

export type RelatedPost = { slug: string; title: string };
export type RelatedRecover = { slug: string; label: string };

// Recover page → 2-3 related blog posts.
export const RELATED_POSTS_BY_RECOVER: Record<string, RelatedPost[]> = {
  "seed-phrase": [
    { slug: "lost-seed-phrase-what-works-2026", title: "Lost Your Seed Phrase? Here's What Actually Works in 2026" },
    { slug: "partial-seed-phrase-11-of-12-words", title: "11 of 12 Words: Can a Partial Seed Phrase Be Recovered?" },
    { slug: "case-file-024-42-btc-3-year-seed-gap", title: "Case File #024: Recovering 4.2 BTC After a 3-Year Seed Gap" },
  ],
  "forgotten-password": [
    { slug: "forgot-metamask-password-recovery-paths", title: "MetaMask Password Forgotten — 6 Recovery Paths Ranked" },
    { slug: "how-wallet-recovery-really-works", title: "How Wallet Recovery Really Works (and How to Spot the Scams)" },
  ],
  "hardware-wallet": [
    { slug: "hardware-wallet-recovery-ledger-trezor", title: "Ledger Locked? Trezor Bricked? Hardware Wallet Recovery, Explained" },
    { slug: "how-wallet-recovery-really-works", title: "How Wallet Recovery Really Works (and How to Spot the Scams)" },
  ],
  metamask: [
    { slug: "forgot-metamask-password-recovery-paths", title: "MetaMask Password Forgotten — 6 Recovery Paths Ranked" },
    { slug: "how-wallet-recovery-really-works", title: "How Wallet Recovery Really Works (and How to Spot the Scams)" },
  ],
  "trust-wallet": [
    { slug: "lost-seed-phrase-what-works-2026", title: "Lost Your Seed Phrase? Here's What Actually Works in 2026" },
    { slug: "how-wallet-recovery-really-works", title: "How Wallet Recovery Really Works (and How to Spot the Scams)" },
  ],
  "exchange-lockout": [
    { slug: "coinbase-recovery-guide", title: "Coinbase Recovery Guide: Locked Accounts, Missing Funds, Wrong-Chain Deposits" },
    { slug: "how-wallet-recovery-really-works", title: "How Wallet Recovery Really Works (and How to Spot the Scams)" },
  ],
  coinbase: [
    { slug: "coinbase-recovery-guide", title: "Coinbase Recovery Guide: Locked Accounts, Missing Funds, Wrong-Chain Deposits" },
    { slug: "long-tail-recovery-trezor-bip39-lost-bitcoin", title: "Trezor, BIP39, and Lost Bitcoin: A Long-Tail Recovery Reference" },
    { slug: "how-wallet-recovery-really-works", title: "How Wallet Recovery Really Works (and How to Spot the Scams)" },
  ],
};

// Blog post category → matching /recover/* service.
export const RELATED_RECOVER_BY_CATEGORY: Record<string, RelatedRecover> = {
  MetaMask: { slug: "metamask", label: "MetaMask Recovery" },
  "Hardware Wallets": { slug: "hardware-wallet", label: "Hardware Wallet Recovery" },
  Guides: { slug: "seed-phrase", label: "Seed Phrase Recovery" },
  "Scam Awareness": { slug: "forgotten-password", label: "Password & Vault Recovery" },
  "Case Files": { slug: "seed-phrase", label: "Seed Phrase Recovery" },
};
