import { createFileRoute } from "@tanstack/react-router";
import { RecoverPage, buildRecoverHead } from "@/components/RecoverPage";

const slug = "forgotten-password";
const h1 = "Forgotten Wallet Password Recovery";
const title = "Forgot Your Wallet Password? Recovery Options Ranked | Wallet Recovery Agent";
const description =
  "Forgot your crypto wallet password? Recovery Agent runs GPU-accelerated password recovery on encrypted wallet files (wallet.dat, keystore, MetaMask vault). No recovery, no fee.";

const faqs = [
  { q: "Which wallets do you handle for password recovery?", a: "Bitcoin Core (wallet.dat), Ethereum keystore (v3), MetaMask vault backups, Electrum, MyEtherWallet, and most Web3 wallets that store an encrypted local vault." },
  { q: "How likely am I to recover it?", a: "Depends heavily on how much you remember. If you can supply patterns — length, character sets, likely words, or old passwords you've reused — success rates are strong. Truly random forgotten passwords are much harder." },
  { q: "Is my wallet file safe to send you?", a: "The encrypted vault file alone is useless without the password — that's the whole point of encryption. But we also work with hashes-only mode when clients prefer, so raw file access is never required." },
  { q: "How long does it take?", a: "From a few minutes (single character mistake) to several weeks (long unknown passwords). We give a realistic timeline before starting." },
  { q: "What does it cost?", a: "Free assessment. Success-only fee (typically 15–20% of recovered funds). No recovery, no fee." },
];

export const Route = createFileRoute("/recover/forgotten-password")({
  head: () => buildRecoverHead({ slug, title, description, h1, faqs }),
  component: () => (
    <RecoverPage
      slug={slug}
      crumbTitle={h1}
      kicker="target_type: password"
      h1={h1}
      intro="You know it's a wallet. You know it's yours. You just can't remember the password you set five years ago. That's not gone — that's a search problem. And search problems get solved with the right hints and enough compute."
      sections={[
        {
          heading: "how password recovery works",
          body:
            "Modern wallet files (wallet.dat, keystore v3, MetaMask vault, etc.) protect keys with a KDF-hardened password. We use custom GPU rigs to test candidate passwords against the vault. The critical input is your MEMORY — not the file.\n\nWhat we ask you for:\n- Length range (was it 8 chars? 20+?)\n- Character sets you tend to use\n- Words, dates, names, or phrases you might have based it on\n- Old passwords you know you've reused elsewhere\n- Any partial recall (\"I think it started with…\")",
        },
        {
          heading: "supported wallet formats",
          body:
            "· Bitcoin Core / Bitcoin Knots — wallet.dat\n· Ethereum keystore v3 (Geth, Parity, MEW, MetaMask exports)\n· MetaMask browser vault (LevelDB extracted)\n· Electrum — encrypted mnemonic and password-protected wallet files\n· Blockchain.info (old .aes.json)\n· Trust Wallet, Rainbow, Phantom vaults\n· BIP-38 encrypted paper wallets",
        },
        {
          heading: "what makes success likely",
          body:
            "Success correlates almost linearly with how much you can narrow the search space.\n\nHigh odds: you remember most of it and just want to test variations.\nMedium odds: you remember the theme (a phrase, a name, a pattern) but not exact chars.\nLow odds: fully random password with no memory hooks.\n\nWe tell you which bucket you're in during the free assessment. No point taking a case we can't win.",
        },
        {
          heading: "safety practices",
          body:
            "· We work on isolated, air-gapped compute nodes.\n· Vault files (or hash-only extracts) are wiped after case closure.\n· You sign a chain-of-custody document. So do we.\n· We never move funds. Once the password is found, YOU authenticate to the wallet and move your own assets. Our job ends there.",
        },
      ]}
      faqs={faqs}
    />
  ),
});
