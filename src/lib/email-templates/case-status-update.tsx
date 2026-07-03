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
  case_title?: string;
  new_status?: string;
  note?: string | null;
  case_url?: string;
  dashboard_url?: string;
}

const SITE_URL = "https://walletrecovery.dev";

const Email = ({
  case_ref = "XXXXXXXX",
  case_title = "Recovery case",
  new_status = "in_progress",
  note = null,
  case_url,
  dashboard_url = `${SITE_URL}/dashboard`,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>
      &gt; case {case_ref} — status: {new_status}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>walletrecovery.dev</Text>
        <Heading style={heading}>&gt; case_update</Heading>

        <Text style={text}>
          There is a new update on your recovery case.
        </Text>

        <Section style={block}>
          <Text style={label}>REF</Text>
          <Text style={value}>{case_ref}</Text>
          <Text style={label}>CASE</Text>
          <Text style={value}>{case_title}</Text>
          <Text style={label}>NEW STATUS</Text>
          <Text style={value}>{new_status}</Text>
          {note ? (
            <>
              <Text style={label}>NOTE</Text>
              <Text style={value}>{note}</Text>
            </>
          ) : null}
        </Section>

        <Text style={text}>See the full timeline and reply to your operative:</Text>
        <Text style={cta}>
          <Link href={case_url || dashboard_url} style={ctaLink}>
            &gt; view_case
          </Link>
        </Text>

        <Hr style={hr} />
        <Text style={fine}>
          Safety reminder: we will never ask for your full seed phrase or
          private key.
        </Text>
        <Text style={fine}>— the walletrecovery.dev team</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: ({ case_ref, new_status }: Props) =>
    `Case ${case_ref ?? ""} — status: ${new_status ?? "updated"}`.trim(),
  displayName: "Case status update",
  previewData: {
    case_ref: "A1B2C3D4",
    case_title: "Ledger — forgotten PIN",
    new_status: "in_progress",
    note: "Operative has started analysis of your device backup.",
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", color: "#0a0a0a" };
const container = { maxWidth: "560px", margin: "0 auto", padding: "32px 24px" };
const brand = { color: "#16a34a", fontSize: "13px", letterSpacing: "0.05em", margin: "0 0 8px" };
const heading = { color: "#0a0a0a", fontSize: "22px", margin: "0 0 20px", fontWeight: 600 };
const text = { color: "#171717", fontSize: "15px", lineHeight: "1.6", margin: "0 0 14px" };
const block = { backgroundColor: "#0a0a0a", borderRadius: "6px", padding: "20px", margin: "20px 0" };
const label = { color: "#4ade80", fontSize: "11px", letterSpacing: "0.08em", margin: "0 0 2px", textTransform: "uppercase" as const };
const value = { color: "#e5e5e5", fontSize: "14px", margin: "0 0 12px" };
const cta = { margin: "18px 0" };
const ctaLink = { display: "inline-block", backgroundColor: "#0a0a0a", color: "#4ade80", padding: "12px 18px", borderRadius: "6px", textDecoration: "none", fontSize: "14px" };
const hr = { borderColor: "#e5e5e5", margin: "28px 0 16px" };
const fine = { color: "#737373", fontSize: "12px", lineHeight: "1.6", margin: "0 0 6px" };
