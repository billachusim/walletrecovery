import { createFileRoute } from "@tanstack/react-router";
import { RecoverPage, buildRecoverHead } from "@/components/RecoverPage";

const slug = "metamask";
const h1 = "MetaMask Recovery";
const title = "MetaMask Password & Vault Recovery — Forgot MetaMask Password | Wallet Recovery Agent";
const description =
  "Forgot your MetaMask password? Lost your seed? Wiped extension? Recovery Agent handles MetaMask vault recovery, browser-profile forensics, and password brute-force. No recovery, no fee.";

const faqs = [
  { q: "I forgot my MetaMask password — is my crypto gone?", a: "Almost certainly not. If your browser profile still has the extension installed and unlocked previously, the encrypted vault is still on your disk. We can recover it by attacking the password, not the seed." },
  { q: "I uninstalled MetaMask without saving my seed. Help?", a: "If you did not clear your browser data, the vault may still be extractable from the browser's LevelDB store — even after uninstall. Time is critical: stop using that browser profile immediately." },
  { q: "Do I need to send you my seed?", a: "No. We refuse full seeds. We work from the encrypted vault or the browser profile export." },
  { q: "What if I wiped my hard drive?", a: "Depending on the wipe method and elapsed time, disk forensics may still recover the LevelDB fragments. Send us the drive; we'll assess." },
  { q: "Cost?", a: "Free assessment. Success-only fee, typically 15–20% of recovered value. No recovery, no fee." },
];

export const Route = createFileRoute("/recover/metamask")({
  head: () => buildRecoverHead({ slug, title, description, h1, faqs }),
  component: () => (
    <RecoverPage
      slug={slug}
      crumbTitle={h1}
      kicker="target_type: metamask"
      h1={h1}
      intro="MetaMask is the most-recovered wallet we handle — because it's the most-used and the easiest to lock yourself out of. Good news: MetaMask stores its encrypted vault right there in your browser. That vault is a solvable problem."
      sections={[
        {
          heading: "the three MetaMask disasters",
          body:
            "1. Forgot the password — vault still installed.\n2. Uninstalled / reset the extension, no seed backup.\n3. Wiped the whole computer, no seed backup.\n\nWe handle all three. Success rate drops as you go down the list.",
        },
        {
          heading: "for case #1: password recovery",
          body:
            "We extract your encrypted vault from the browser profile (Chrome, Brave, Firefox all supported), then run GPU-accelerated password cracking against it using hints you provide.\n\nBefore we start: DO NOT reinstall MetaMask over the existing profile. That can wipe the vault. Freeze the profile — copy the entire `Local Extension Settings/nkbihfbeogaeaoehlefnkodbefgpgknn/` folder to a USB drive and stop using that profile.",
        },
        {
          heading: "for cases #2 and #3: forensic extraction",
          body:
            "If you've uninstalled MetaMask or wiped the drive, the vault may still exist as LevelDB fragments. This is forensic work: disk imaging, sector recovery, LevelDB reconstruction. Feasibility depends heavily on:\n\n· How long ago the wipe / uninstall happened\n· How much you've used the drive since\n· Whether SSD TRIM was enabled (bad news) or HDD (better news)\n\nWe'll tell you honestly during assessment whether it's worth attempting.",
        },
        {
          heading: "what to do immediately",
          body:
            "1. Stop using the affected computer / browser profile. Every hour of use lowers your odds.\n2. If it's an SSD, unplug it if possible.\n3. Do NOT reinstall or reset MetaMask.\n4. Open a case with the AI agent. Free. 5 minutes.\n5. Ship the drive (or provide remote forensics access) once we've agreed on scope.",
        },
      ]}
      faqs={faqs}
    />
  ),
});
