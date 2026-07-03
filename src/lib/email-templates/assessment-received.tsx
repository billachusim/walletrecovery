import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  case_ref?: string;
  wallet_type?: string;
  loss_reason?: string;
  is_authenticated?: boolean;
  dashboard_url?: string;
  signup_url?: string;
}

const SITE_URL = "https://walletrecovery.dev";

const Email = ({
  case_ref = "XXXXXXXX",
  wallet_type = "unknown",
  loss_reason = "unknown",
  is_authenticated = false,
  dashboard_url = `${SITE_URL}/dashboard`,
  signup_url = `${SITE_URL}/auth?mode=signup`,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>&gt; assessment received — ref {case_ref}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>walletrecovery.dev</Text>
        <Heading style={heading}>&gt; assessment_received</Heading>

        <Text style={text}>
          Your recovery assessment is in. A senior operative will review the
          details and follow up within 24–48 hours.
        </Text>

        <Section style={block}>
          <Text style={label}>REF</Text>
          <Text style={value}>{case_ref}</Text>
          <Text style={label}>WALLET</Text>
          <Text style={value}>{wallet_type}</Text>
          <Text style={label}>LOSS REASON</Text>
          <Text style={value}>{loss_reason}</Text>
        </Section>

        {is_authenticated ? (
          <>
            <Text style={text}>
              Track progress and message the operative from your dashboard:
            </Text>
            <Text style={cta}>
              <Link href={dashboard_url} style={ctaLink}>
                &gt; open_dashboard
              </Link>
            </Text>
          </>
        ) : (
          <>
            <Text style={text}>
              To follow this case, receive progress alerts, and message the
              operative, create an account with this email:
            </Text>
            <Text style={cta}>
              <Link href={signup_url} style={ctaLink}>
                &gt; create_account
              </Link>
            </Text>
          </>
        )}

        <Hr style={hr} />
        <Text style={fine}>
          Safety reminder: we will never ask for your full seed phrase or
          private key. Anyone requesting them is not us.
        </Text>
        <Text style={fine}>
          — the walletrecovery.dev team
        </Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: ({ case_ref }: Props) => `Assessment received — ref ${case_ref ?? ""}`.trim(),
  displayName: "Assessment received",
  previewData: {
    case_ref: "A1B2C3D4",
    wallet_type: "ledger",
    loss_reason: "forgotten PIN",
    is_authenticated: false,
  },
} satisfies TemplateEntry;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  color: "#0a0a0a",
};
const container = { maxWidth: "560px", margin: "0 auto", padding: "32px 24px" };
const brand = { color: "#16a34a", fontSize: "13px", letterSpacing: "0.05em", margin: "0 0 8px" };
const heading = { color: "#0a0a0a", fontSize: "22px", margin: "0 0 20px", fontWeight: 600 };
const text = { color: "#171717", fontSize: "15px", lineHeight: "1.6", margin: "0 0 14px" };
const block = { backgroundColor: "#0a0a0a", borderRadius: "6px", padding: "20px", margin: "20px 0" };
const label = { color: "#4ade80", fontSize: "11px", letterSpacing: "0.08em", margin: "0 0 2px", textTransform: "uppercase" as const };
const value = { color: "#e5e5e5", fontSize: "14px", margin: "0 0 12px" };
const cta = { margin: "18px 0" };
const ctaLink = {
  display: "inline-block",
  backgroundColor: "#0a0a0a",
  color: "#4ade80",
  padding: "12px 18px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "14px",
};
const hr = { borderColor: "#e5e5e5", margin: "28px 0 16px" };
const fine = { color: "#737373", fontSize: "12px", lineHeight: "1.6", margin: "0 0 6px" };
