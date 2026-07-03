import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listMyAssessments from "./tools/list-my-assessments";
import listMyCases from "./tools/list-my-cases";
import getCase from "./tools/get-case";
import createAssessment from "./tools/create-assessment";
import openCase from "./tools/open-case";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "wallet-recovery-mcp",
  title: "Wallet Recovery Agent",
  version: "0.2.0",
  instructions:
    "Tools for the signed-in Wallet Recovery Agent user. Read: list_my_assessments, list_my_cases, get_case. Write: create_assessment to submit a new recovery request, open_case to open a formal case. NEVER ask the user for or forward a full seed phrase or private key — only wallet type, loss reason, and safe hints.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listMyAssessments, listMyCases, getCase, createAssessment, openCase],
});
