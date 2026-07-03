import { defineTool } from "@lovable.dev/mcp-js";

const SCENARIOS = [
  { id: "forgot_password", label: "Forgotten wallet password", description: "You know the wallet exists but can't remember the password (MetaMask, Exodus, Electrum, encrypted keystore files)." },
  { id: "partial_seed", label: "Partial or scrambled seed phrase", description: "You have some of the 12/24 words, or the order is uncertain." },
  { id: "corrupted_file", label: "Corrupted wallet file", description: "Wallet.dat or keystore file is damaged but partially readable." },
  { id: "damaged_device", label: "Damaged hardware wallet", description: "Ledger or Trezor physically broken; recovery via seed backup or forensic extraction." },
  { id: "deleted_file", label: "Deleted wallet file", description: "Keystore or wallet file was deleted from disk and may be recoverable." },
  { id: "exchange_lockout", label: "Exchange account lockout", description: "Locked out of Binance/Coinbase/Kraken/etc. — 2FA loss, KYC issues, or account suspension." },
  { id: "forgot_pin", label: "Forgotten hardware wallet PIN", description: "Device is intact but the PIN is lost; recovery via seed backup." },
];

export default defineTool({
  name: "list_recovery_scenarios",
  title: "List recovery scenarios",
  description: "Public list of loss scenarios Wallet Recovery Agent handles, with one-line descriptions. Use to match a user's situation to a scenario. No sign-in required.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(SCENARIOS, null, 2) }],
    structuredContent: { scenarios: SCENARIOS },
  }),
});
