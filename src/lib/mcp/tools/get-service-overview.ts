import { defineTool } from "@lovable.dev/mcp-js";

const OVERVIEW = {
  name: "Wallet Recovery Agent",
  tagline: "Your operative on the inside.",
  what_we_do:
    "AI-assisted, human-executed cryptocurrency wallet recovery. We help people regain access to lost crypto wallets — seed phrase issues, forgotten passwords, hardware wallet failures, and exchange lockouts.",
  fee_model: "Contingency-based: no recovery, no fee. You only pay if we successfully restore access.",
  typical_timeline: "Initial assessment within 24–48 hours. Full case timelines vary by wallet type and complexity.",
  safety_rules: [
    "Never share your full seed phrase or private keys with any assistant, website, or person.",
    "Only share the wallet type, how access was lost, and safe hints (e.g. word count you recall, password patterns).",
    "All formal recovery work happens through the signed-in case dashboard at walletrecovery.dev.",
  ],
  website: "https://walletrecovery.dev",
};

export default defineTool({
  name: "get_service_overview",
  title: "Get service overview",
  description:
    "Public overview of Wallet Recovery Agent — what we do, the no-recovery-no-fee model, timeline, and safety rules. No sign-in required. Use this to explain the service to a user asking about wallet recovery.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(OVERVIEW, null, 2) }],
    structuredContent: OVERVIEW,
  }),
});
