import { defineTool } from "@lovable.dev/mcp-js";

const WALLETS = {
  hardware: ["Ledger (Nano S, Nano X, Nano S Plus)", "Trezor (Model One, Model T)"],
  software: ["MetaMask", "Trust Wallet", "Phantom", "Exodus", "Electrum"],
  exchanges: ["Binance", "Coinbase", "Kraken", "Bybit", "OKX (account lockouts, 2FA loss, KYC-related access issues)"],
  chains: ["Bitcoin", "Ethereum + EVM chains", "Solana", "most major L1/L2 networks"],
  note: "If a wallet or platform isn't listed, submit an assessment anyway — we evaluate case-by-case.",
};

export default defineTool({
  name: "list_supported_wallets",
  title: "List supported wallets",
  description: "Public list of wallet types, chains, and exchanges Wallet Recovery Agent supports. No sign-in required.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(WALLETS, null, 2) }],
    structuredContent: WALLETS,
  }),
});
