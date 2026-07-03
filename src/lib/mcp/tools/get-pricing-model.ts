import { defineTool } from "@lovable.dev/mcp-js";

const PRICING = {
  model: "Contingency — no recovery, no fee.",
  summary: "You pay nothing unless we successfully restore access to your wallet. The fee is a percentage of the recovered value, quoted per case after assessment.",
  typical_fee_range: "Typically 10%–20% of recovered wallet value, depending on complexity and estimated effort. Exact percentage is agreed in writing before recovery work begins.",
  what_is_free: ["Initial assessment", "Feasibility review", "Case scoping"],
  what_you_pay_for: "Only a successful recovery. Failed attempts cost you nothing.",
  more_info: "https://walletrecovery.dev/pricing",
};

export default defineTool({
  name: "get_pricing_model",
  title: "Get pricing model",
  description: "Public summary of Wallet Recovery Agent's pricing: contingency-based, no recovery no fee. Use when a user asks how much recovery costs. No sign-in required.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(PRICING, null, 2) }],
    structuredContent: PRICING,
  }),
});
