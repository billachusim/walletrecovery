# Coinbase Recovery Guide: Locked Accounts, Missing Funds, and Wrong-Chain Deposits

Lost access to your Coinbase account? Sent tokens to a Coinbase address on the wrong network? Two-step verification bricked after a phone swap? This is the operative's field manual — what Coinbase support can actually fix, what they can't, and where a specialist crew like [Wallet Recovery Agent](/) becomes the escalation path.

## What "Coinbase recovery" actually covers

Coinbase recovery is a wide bucket. Most people typing that into Google are really trying to solve one of five distinct problems:

1. **Account lockout** — 2FA lost, email hijacked, or ID verification loop.
2. **Missing or reversed transactions** — a withdrawal that never arrived, or a deposit that vanished.
3. **Wrong-chain deposits** — ERC-20 tokens sent to a BEP-20 address, or vice versa.
4. **Unsupported token deposits** — a legitimate ERC-20 token sent to your Coinbase ETH address, but Coinbase doesn't list it.
5. **Coinbase Wallet (self-custody)** recovery — this is a *separate* product from Coinbase.com, and it's a wallet recovery problem, not a support ticket.

Each has a different playbook. Get the diagnosis right or you'll waste weeks in the wrong queue.

---

## 1. Locked out of your Coinbase.com account

### Standard path (do this first)

- Go to **coinbase.com/signin** and click *Forgot password*.
- If 2FA is the blocker, use *Try another way* → *Account recovery*. Coinbase runs a mandatory security wait (usually 24–72 hours) after a 2FA reset. That's a feature, not a bug — it prevents an attacker who just phished your password from draining you.
- Have ready: government ID, a selfie, the last 4 digits of the payment method on file, and access to the original signup email.

### When standard recovery fails

Common reasons Coinbase support hits a wall:

- The email inbox itself has been compromised, and the attacker is intercepting reset links.
- ID verification loops — the same document keeps being rejected without a clear reason.
- The account was created years ago under a maiden name, old passport, or a country you've since left.
- You suspect the account has been SIM-swapped and someone else is now inside it.

These are exactly the cases a specialist takes over. See [Exchange lockout escalation](/recover/exchange-lockout) for how we document, escalate, and (where legally possible) recover custody through provable identity.

### If your account is showing withdrawals you didn't make

Stop everything. Do not close the ticket. Do not "log in and check" from the same device.

1. From a **different device on a different network**, freeze the account via *Settings → Security → Lock account*.
2. File a police report — Coinbase's fraud team requires a case number for any escalation involving unauthorized activity.
3. Contact your bank if any card or ACH was linked; some withdrawals can be reversed within 60 days.
4. Preserve every notification email, SMS, and login-alert timestamp. Do not delete anything.

[Talk to an operative](/assessment) before you send Coinbase a second message. What you say in the first 72 hours shapes the entire investigation.

---

## 2. Missing transactions and pending withdrawals

A Coinbase transaction can be in one of three states most people confuse:

- **Pending on Coinbase** — still inside Coinbase's system, no on-chain broadcast yet. Check *Activity* for a spinner.
- **Broadcast, unconfirmed** — sent to the network but not yet in a block. Bitcoin can sit here for hours if the fee is low; Ethereum for minutes.
- **Confirmed, wrong destination** — hit the blockchain, arrived somewhere, but not where you expected.

To diagnose, grab the transaction hash from *Activity → transaction details* and look it up on a block explorer:

- BTC → **mempool.space** or **blockstream.info**
- ETH / ERC-20 → **etherscan.io**
- Solana → **solscan.io**
- Base → **basescan.org**

If the hash confirms to an address you don't recognize, treat it as a compromise and follow the account-lockout playbook above. If the hash never appears on the explorer at all, it's still inside Coinbase — open a ticket referencing the internal transaction ID.

---

## 3. Wrong-chain deposits (the expensive mistake)

You bought USDT on Binance, hit *Withdraw*, and picked **BEP-20 (BSC)** instead of **ERC-20**. Coinbase gave you an Ethereum address. The funds show as *sent* on Binance, but nothing arrives on Coinbase.

Good news: on EVM chains, most addresses derive from the same public key — the same address controls funds across Ethereum, BSC, Polygon, Arbitrum, Optimism, Base, and Avalanche C-Chain. The tokens are not lost. They are sitting at your Coinbase-generated address on the *wrong* network.

Bad news: Coinbase custodies the private key. They can technically sweep the wrong-chain balance, but only for a **short list of supported networks and tokens**, and only after a manual review that can take 4–12 weeks. As of 2026 they explicitly do **not** sweep from every chain, and they charge a recovery fee (often 5% of the balance, minimum $100).

### The escalation path

1. File the ticket via *Help → I sent crypto on the wrong network*. Attach the tx hash, sending exchange, network, token contract, and destination address.
2. Do **not** send more funds to "test" the address — you'll multiply the problem.
3. If Coinbase declines (unsupported chain or token), the recovery is a private-key extraction problem. Wallet Recovery Agent has partner attorneys and forensic engineers who can, in some jurisdictions, compel a signed transaction from a custodian for provable-owner funds. Start at [Exchange lockout escalation](/recover/exchange-lockout).

---

## 4. Unsupported token deposits

Someone sends you `$SHIBRARE` to your Coinbase ETH address. The token is a real ERC-20, but Coinbase doesn't list it. The balance won't show up in your account. It's not lost — it's at your Coinbase deposit address, which Coinbase controls.

The playbook is the same as wrong-chain: open a ticket, wait for the recovery-review workflow, expect a fee. If declined, the case moves to specialist recovery.

**Never** import your "Coinbase seed phrase" into MetaMask to sign this transaction yourself. Coinbase.com accounts do not have a user-facing seed phrase — anyone asking for one is a scam. Coinbase **Wallet** (self-custody) does, and that's a different product.

---

## 5. Coinbase Wallet (self-custody) is a different beast

If you're using Coinbase Wallet — the standalone app with a 12-word seed phrase — you own the keys, and Coinbase support cannot help you at all. Lost password, missing phrase words, or a bricked device becomes a wallet-recovery problem, not a support ticket.

- Forgot the app password but you have the seed phrase? Reinstall the app and *Restore existing wallet*.
- Lost the seed phrase? See [Seed phrase reconstruction](/recover/seed-phrase) — with partial words and BIP-39 checksums we can rebuild a 12-word phrase for the right cases.
- Have the phrase but forgot a custom passphrase (the "25th word")? See [Forgotten password recovery](/recover/forgotten-password). We run GPU-accelerated dictionary attacks with hints from you.
- Coinbase Wallet on a phone that no longer boots? See [Hardware wallet recovery](/recover/hardware-wallet) for damaged-device forensics.

---

## What Coinbase will *never* do

If you see any of these, it is a scam. Close the tab. Block the number.

- Ask for your seed phrase.
- Ask you to "sync" your wallet with a support agent.
- Send you a QR code to scan into WalletConnect.
- Direct-message you first on Telegram, WhatsApp, Discord, or Twitter/X.
- Offer to reverse a blockchain transaction for a fee.

Real Coinbase support only responds inside authenticated tickets and never asks for keys. Every "recovery service" that promises to reverse a blockchain transaction is either a scam or badly informed — public blockchain transactions are, by design, irreversible. What can be recovered is **access to a wallet you already own**, not funds you sent to someone else.

---

## When to escalate to Wallet Recovery Agent

Coinbase support handles the volume cases: forgot-password, standard 2FA reset, supported-token wrong-chain sweeps. Escalate to a specialist crew when:

- Support has closed your ticket twice with the same boilerplate.
- The account is entangled with a suspected SIM swap, phishing kit, or malware.
- The wrong-chain deposit is on an unsupported network.
- You need forensic documentation for law enforcement or an insurance claim.
- Coinbase Wallet (self-custody) is the actual product involved.

We run a private AI-agent assessment first, then a senior human operative reviews the file within 24 hours. No plaintext seed phrase is ever required. **No recovery, no fee.**

[Start the assessment](/assessment) — 3 minutes, private terminal, zero risk.

## Frequently asked questions

### Can Coinbase reverse a transaction I sent to the wrong person?

No — and neither can anyone else. Public blockchain transactions are irreversible by design. Coinbase can sometimes recover funds you sent to your own Coinbase-controlled address on a supported wrong network, but never funds that left their custody to a third party.

### How long does Coinbase account recovery take?

The mandatory security wait after a 2FA reset is typically 24–72 hours. Full ID-verified recovery for complex cases (email compromise, name changes, old accounts) can take 2–6 weeks. Wrong-chain deposit recoveries take 4–12 weeks when accepted.

### Does Coinbase have a recovery phrase for my Coinbase.com account?

No. Only Coinbase Wallet (the self-custody product) uses a seed phrase. Coinbase.com custodial accounts use email, password, and 2FA — anyone asking for a Coinbase "seed phrase" for a Coinbase.com account is a scammer.

### What does Coinbase's wrong-chain recovery cost?

Coinbase typically charges 5% of the recovered balance with a $100 minimum, only for supported networks and tokens, and only after a manual review that can take months. Unsupported networks are declined outright.

### Is it safe to give a "recovery service" my seed phrase?

No. A legitimate recovery service will never require your full seed phrase in plaintext. Wallet Recovery Agent's workflow is built so that no operative ever sees a complete phrase — we use partial data, checksums, and cryptographic search. If anyone asks for your full 12 or 24 words up front, walk away.

### Can I recover a Coinbase account with only my email?

Not on its own. You'll need the email, access to a linked payment method or ID, and either your 2FA or the ability to prove ownership via ID verification. If you've lost the email inbox too, escalate immediately — the account is at risk of takeover.
