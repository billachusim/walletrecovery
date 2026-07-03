import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Free Recovery Assessment — Wallet Recovery" },
      { name: "description", content: "Submit a free recovery assessment for your lost cryptocurrency wallet. We analyze your situation and estimate recovery probability." },
    ],
  }),
  component: AssessmentPage,
});

const WALLET_TYPES = [
  "Bitcoin (BTC)",
  "Ethereum (ETH)",
  "Litecoin (LTC)",
  "Ripple (XRP)",
  "Cardano (ADA)",
  "Solana (SOL)",
  "Hardware Wallet (Ledger/Trezor)",
  "Multi-currency Wallet",
  "Other",
];

const LOSS_REASONS = [
  "Forgot password",
  "Partial recovery phrase (missing words)",
  "Corrupted wallet file",
  "Damaged device / hard drive",
  "Deleted wallet file",
  "Lost access to exchange account",
  "Other",
];

function AssessmentPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [walletType, setWalletType] = useState("");
  const [lossReason, setLossReason] = useState("");
  const [details, setDetails] = useState("");
  const [partialPhrase, setPartialPhrase] = useState("");
  const [passwordHints, setPasswordHints] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const assessmentData = {
        user_id: user?.id ?? null,
        guest_email: guestEmail || null,
        wallet_type: walletType,
        loss_reason: lossReason,
        details: details || null,
        partial_phrase: partialPhrase || null,
        partial_password_hints: passwordHints || null,
        estimated_value: estimatedValue ? parseFloat(estimatedValue) : null,
      };

      const { error: insertError } = await supabase.from("assessments").insert(assessmentData);

      if (insertError) {
        setError(insertError.message);
      } else {
        setSubmitted(true);
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
            <h2 className="mt-4 text-2xl font-bold text-foreground">Assessment Submitted</h2>
            <p className="mt-2 text-muted-foreground">
              Thank you for your submission. Our team will review your case and provide an estimated recovery probability within 24–48 hours.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Return to Home
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Create an Account to Track Progress
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
            Wallet Recovery
          </Link>
          <Link
            to="/auth"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Free Recovery Assessment</h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about your wallet loss and we'll estimate your recovery chances. No obligation.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Step {step} of 3</CardTitle>
            <CardDescription>
              {step === 1 && "What type of wallet and loss scenario?"}
              {step === 2 && "Provide details and any clues you have."}
              {step === 3 && "Estimated value and contact information."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="walletType">Wallet Type</Label>
                  <Select value={walletType} onValueChange={setWalletType}>
                    <SelectTrigger id="walletType">
                      <SelectValue placeholder="Select wallet type" />
                    </SelectTrigger>
                    <SelectContent>
                      {WALLET_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lossReason">Loss Reason</Label>
                  <Select value={lossReason} onValueChange={setLossReason}>
                    <SelectTrigger id="lossReason">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOSS_REASONS.map((reason) => (
                        <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="details">Additional Details</Label>
                  <Textarea
                    id="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Describe what happened, when you last had access, and anything else that might help..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="partialPhrase">Partial Recovery Phrase (if applicable)</Label>
                  <Textarea
                    id="partialPhrase"
                    value={partialPhrase}
                    onChange={(e) => setPartialPhrase(e.target.value)}
                    placeholder="Enter the words you remember, with placeholders for missing ones..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Only share what you are comfortable with. We never store raw recovery phrases in plain text.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordHints">Password Hints or Patterns</Label>
                  <Textarea
                    id="passwordHints"
                    value={passwordHints}
                    onChange={(e) => setPasswordHints(e.target.value)}
                    placeholder="Any patterns, words, or dates you might have used..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedValue">Estimated Wallet Value (USD)</Label>
                  <Input
                    id="estimatedValue"
                    type="number"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                    placeholder="e.g. 5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestEmail">Email Address</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    We will send your assessment results to this email.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!walletType || !lossReason)) ||
                    (step === 2 && false)
                  }
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!guestEmail || !walletType || !lossReason || loading}
                >
                  {loading ? "Submitting..." : "Submit Assessment"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
