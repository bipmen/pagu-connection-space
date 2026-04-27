import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — Pagu" },
      { name: "description", content: "Join the Pagu community. Curated, safe spaces for FLINTA* people." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl mb-3">Join Pagu</h1>
            <p className="text-muted-foreground text-sm text-balance">
              A curated FLINTA* community. We take time to welcome each person intentionally.
            </p>
          </div>

          <form className="space-y-5 bg-card border border-border/60 rounded-2xl p-6 shadow-soft">
            <Field label="Name" placeholder="Your name" />
            <Field label="Email or phone" placeholder="you@example.com" />
            <Field label="2FA method" placeholder="Receive code by email or SMS" />
            <Field label="Referral (optional)" placeholder="Email of a member who invited you" />

            <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4">
              <ShieldCheck className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Profile subject to approval.</strong> We review every request to keep our spaces safe and intentional for FLINTA* people. We'll get back to you within a few days.
              </p>
            </div>

            <Button type="button" variant="hero" size="lg" className="w-full">Send request</Button>
            <p className="text-center text-sm text-muted-foreground">
              Already a member? <Link to="/login" className="text-gold hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="mt-2 w-full bg-input/50 border border-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60"
      />
    </div>
  );
}
