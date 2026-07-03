import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Wallet Recovery Agent | Reach a Human Operative" },
      { name: "description", content: "Contact the Wallet Recovery Agent team. Direct email, encrypted channels, and 24-hour response for open cases. Free assessment before any commitment." },
      { property: "og:title", content: "Contact Wallet Recovery Agent" },
      { property: "og:description", content: "Reach a human operative. Encrypted channels available." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Contact Us</h1>
          <p className="mt-4 text-muted-foreground">
            Have questions about our services or need help with your case? We're here to help.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Get in Touch</h2>
            <div className="mt-6 space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">support@walletrecovery.example</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">Available for active cases</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">Remote-first team, worldwide service</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            {sent ? (
              <Alert>
                <AlertDescription>Thank you for reaching out. We'll get back to you within 24 hours.</AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border px-4 py-10">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} wallet_recovery_agent // your operative on the inside
        </div>
      </footer>
    </div>
  );
}
