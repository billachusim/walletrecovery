import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listMyAssessments from "./tools/list-my-assessments";
import listMyCases from "./tools/list-my-cases";
import getCase from "./tools/get-case";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "wallet-recovery-mcp",
  title: "Wallet Recovery Agent",
  version: "0.1.0",
  instructions:
    "Tools for the signed-in Wallet Recovery Agent user. Use `list_my_assessments` and `list_my_cases` to see the user's items, and `get_case` for full details. Never ask the user for a full seed phrase or private key.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listMyAssessments, listMyCases, getCase],
});
