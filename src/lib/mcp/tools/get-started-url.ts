import { defineTool } from "@lovable.dev/mcp-js";

const URLS = {
  home: "https://walletrecovery.dev",
  new_assessment: "https://walletrecovery.dev/assessment",
  sign_in: "https://walletrecovery.dev/auth",
  case_dashboard: "https://walletrecovery.dev/console",
  pricing: "https://walletrecovery.dev/pricing",
  faq: "https://walletrecovery.dev/faq",
  safety_reminder:
    "Never share a full seed phrase or private key with any assistant or website — only wallet type, loss reason, and safe hints.",
};

export default defineTool({
  name: "get_started_url",
  title: "Get started URLs",
  description: "Canonical URLs for starting a wallet recovery: assessment form, sign-in, case dashboard, pricing, FAQ. Use when directing a user to take action on walletrecovery.dev. No sign-in required.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(URLS, null, 2) }],
    structuredContent: URLS,
  }),
});
