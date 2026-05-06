import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Pagu" },
      { name: "description", content: "Login to your Pagu community account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [tipOpen, setTipOpen] = useState(false);
  const isEmail = method === "email";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl mb-3">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to continue with the community.</p>
          </div>

          <form className="space-y-5 bg-card border border-border/60 rounded-2xl p-6 shadow-soft">
            <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-full text-xs">
              <button
                type="button"
                onClick={() => setMethod("email")}
                className={`py-2 rounded-full inline-flex items-center justify-center gap-1.5 transition-colors ${isEmail ? "bg-background shadow-soft" : "text-muted-foreground"}`}
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </button>
              <button
                type="button"
                onClick={() => setMethod("phone")}
                className={`py-2 rounded-full inline-flex items-center justify-center gap-1.5 transition-colors ${!isEmail ? "bg-background shadow-soft" : "text-muted-foreground"}`}
              >
                <Phone className="h-3.5 w-3.5" /> Phone
              </button>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                {isEmail ? "Email" : "Phone"}
              </label>
              <input
                type={isEmail ? "email" : "tel"}
                className="mt-2 w-full bg-input/50 border border-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
                placeholder={isEmail ? "you@example.com" : "+1 555 123 4567"}
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We'll send you a{" "}
              <Popover open={tipOpen} onOpenChange={setTipOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    onMouseEnter={() => setTipOpen(true)}
                    onMouseLeave={() => setTipOpen(false)}
                    onFocus={() => setTipOpen(true)}
                    onBlur={() => setTipOpen(false)}
                    className="text-gold underline decoration-dotted underline-offset-4 hover:text-gold/80 transition-colors cursor-help"
                  >
                    one-time verification code
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="start"
                  className="w-64 text-xs leading-relaxed border-gold/30 shadow-md animate-in fade-in-0 zoom-in-95"
                >
                  <p className="font-medium text-foreground mb-1">What is 2FA?</p>
                  <p className="text-muted-foreground">
                    2FA (two-factor authentication) is an extra security step. We send a code to your {isEmail ? "email" : "phone"} so only you can access your account.
                  </p>
                </PopoverContent>
              </Popover>{" "}
              to sign in — no password needed.
            </p>
            <Button type="button" variant="hero" size="lg" className="w-full">Send code</Button>
            <p className="text-center text-sm text-muted-foreground">
              New here? <Link to="/register" className="text-gold hover:underline">Create an account</Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
