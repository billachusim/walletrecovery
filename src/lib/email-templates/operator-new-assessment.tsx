import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  case_ref?: string;
  wallet_type?: string;
  loss_reason?: string;
  contact_email?: string | null;
  estimated_value?: number | null;
  recovery_probability?: number | null;
  is_authenticated?: boolean;
}

const OPERATOR_EMAIL = process.env.OPERATOR_EMAIL ?? "";

const Email = ({
  case_ref = "XXXXXXXX",
  wallet_type = "unknown",
  loss_reason = "unknown",
  contact_email = null,
  estimated_value = null,
  recovery_probability = null,
  is_authenticated = false,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>&gt; new_assessment {case_ref}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>&gt; new_assessment received</Heading>
        <Section style={block}>
          <Text style={row}>
            <span style={label}>REF: </span>
            <span style={value}>{case_ref}</span>
          </Text>
          <Text style={row}>
            <span style={label}>WALLET: </span>
            <span style={value}>{wallet_type}</span>
          </Text>
          <Text style={row}>
            <span style={label}>LOSS REASON: </span>
            <span style={value}>{loss_reason}</span>
          </Text>
          <Text style={row}>
            <span style={label}>CONTACT: </span>
            <span style={value}>
              {contact_email ?? "—"}
              {is_authenticated ? " (signed-in)" : " (guest)"}
            </span>
          </Text>
          <Text style={row}>
            <span style={label}>EST. VALUE: </span>
            <span style={value}>{estimated_value ? `$${estimated_value}` : "—"}</span>
          </Text>
          <Text style={row}>
            <span style={label}>PROBABILITY: </span>
            <span style={value}>{recovery_probability != null ? `${recovery_probability}%` : "—"}</span>
          </Text>
        </Section>
        <Text style={fine}>Review in the operator console.</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: ({ case_ref, wallet_type }: Props) =>
    `New assessment ${case_ref ?? ""} — ${wallet_type ?? ""}`.trim(),
  displayName: "Operator: new assessment",
  to: OPERATOR_EMAIL || undefined,
  previewData: {
    case_ref: "A1B2C3D4",
    wallet_type: "ledger",
    loss_reason: "forgotten PIN",
    contact_email: "user@example.com",
    estimated_value: 12000,
    recovery_probability: 65,
    is_authenticated: true,
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", color: "#0a0a0a" };
const container = { maxWidth: "560px", margin: "0 auto", padding: "24px" };
const heading = { color: "#0a0a0a", fontSize: "20px", margin: "0 0 16px", fontWeight: 600 };
const block = { backgroundColor: "#0a0a0a", borderRadius: "6px", padding: "20px" };
const row = { color: "#e5e5e5", fontSize: "13px", margin: "0 0 8px", lineHeight: "1.5" };
const label = { color: "#4ade80" };
const value = { color: "#e5e5e5" };
const fine = { color: "#737373", fontSize: "12px", margin: "16px 0 0" };
