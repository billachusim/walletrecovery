import { createFileRoute } from "@tanstack/react-router";
import { RecoverPage, buildRecoverHead } from "@/components/RecoverPage";

const slug = "hardware-wallet";
const h1 = "Hardware Wallet Recovery (Ledger, Trezor, KeepKey)";
const title = "Hardware Wallet Recovery — Ledger, Trezor, KeepKey | Wallet Recovery Agent";
const description =
  "Ledger locked? Trezor bricked? Hardware wallet PIN forgotten? Recovery Agent handles Ledger Nano, Trezor One/T, and KeepKey recovery with chain-of-custody guarantees. No recovery, no fee.";

const faqs = [
  { q: "My Ledger asks for a PIN I forgot — can I recover it?", a: "Yes, if you still have the 24-word recovery phrase from initial setup. If BOTH the PIN and recovery phrase are lost, the device itself cannot be unlocked — but partial seed recovery may still succeed." },
  { q: "My Trezor firmware upgrade bricked it. Now what?", a: "In most cases the seed on the device is safe and can be restored to a replacement device via your recovery phrase. If the phrase is also lost, contact us for a forensic assessment." },
  { q: "Can you physically extract keys from a hardware wallet?", a: "Modern secure-element devices (Ledger Nano X/S+, Trezor Safe) are designed to resist physical extraction. We're honest with clients: for these devices, without the recovery phrase, recovery is extremely limited." },
  { q: "What about older Trezor One / KeepKey?", a: "Older devices without secure elements have known physical attack surfaces. Recovery is more feasible on these, but requires specialized lab equipment. Case-by-case assessment." },
  { q: "How much does hardware wallet recovery cost?", a: "Free assessment. If we take the case, success-only fee (15–20% typical, higher for lab-based physical recovery). No recovery, no fee." },
];

export const Route = createFileRoute("/recover/hardware-wallet")({
  head: () => buildRecoverHead({ slug, title, description, h1, faqs }),
  component: () => (
    <RecoverPage
      slug={slug}
      crumbTitle={h1}
      kicker="target_type: hardware"
      h1={h1}
      intro="A hardware wallet is the safest place to keep crypto — until you forget the PIN, brick it in a firmware update, or lose the recovery card that came with it. Every hardware wallet failure mode has a recovery path. Some are easy. Some need a lab. We know which is which."
      sections={[
        {
          heading: "supported devices",
          body:
            "· Ledger — Nano S, Nano S Plus, Nano X, Blue, Stax\n· Trezor — One, Model T, Safe 3, Safe 5\n· KeepKey (ShapeShift)\n· Coldcard Mk1–Mk4\n· BitBox02\n· Older devices: TREZOR Model One (pre-2020), Ledger HW.1",
        },
        {
          heading: "the three failure modes",
          body:
            "1. Forgotten PIN, recovery phrase intact — Easiest. We help you set up a replacement device and restore from your existing seed. Usually you don't even need us for this; we'll tell you if you can DIY.\n\n2. Bricked / dead device, recovery phrase intact — Same as above. The device is a container; the seed is what matters.\n\n3. Recovery phrase lost or partial — This is where we earn our fee. Depending on the device generation and how much of the seed you recall, we combine forensic techniques (see /recover/seed-phrase for math details) with device-specific approaches.",
        },
        {
          heading: "physical device workflow",
          body:
            "When a case requires the physical device:\n· You ship it via insured, tracked courier (we cover cost on approved cases).\n· Device is logged into evidence at intake. Photographed. Sealed.\n· All work is done in a monitored lab. Video-logged on request.\n· Device is returned to you (or destroyed on your instruction) at case close.\n\nEvery step is on the signed chain-of-custody. You always know where your device is.",
        },
        {
          heading: "what to do RIGHT NOW",
          body:
            "· Do not attempt more than 3 PIN guesses. Many devices wipe after 3 failures.\n· Do not update firmware while trying to recover — it can destroy on-device data.\n· Do not send your recovery phrase to ANYONE. Not us. Not \"support.\" No exceptions.\n· Do talk to our AI agent for a free 5-minute triage.",
        },
      ]}
      faqs={faqs}
    />
  ),
});
