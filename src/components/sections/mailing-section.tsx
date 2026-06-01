import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Instagram, Loader2 } from "lucide-react";
import { submitToSheet } from "@/lib/sheets";

const emailSchema = z.string().trim().email();
const SESSION_KEY = "pagu:newsletter-subscribed";

type Status = "idle" | "submitting" | "success" | "error";

export function MailingSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      return "success";
    }
    return "idle";
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      setStatus("success");
      return;
    }
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setErrorMsg("Please enter a valid email.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMsg(null);
    try {
      await submitToSheet({
        sheet: "Newsletter Subscribers",
        values: [parsed.data, "Website"],
      });
      sessionStorage.setItem(SESSION_KEY, "1");
      setStatus("success");
    } catch {
      setErrorMsg("Something went wrong. Please try again later.");
      setStatus("error");
    }
  }

  return (
    <section className="px-5 lg:px-8 max-w-7xl mx-auto py-20">
      <div className="rounded-3xl border border-gold/30 bg-gradient-hero p-8 md:p-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-background/40" />
        <div className="relative max-w-xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Stay close</p>
          <h2 className="font-display text-4xl md:text-5xl text-balance mb-4">
            Stay <em className="text-gold not-italic">connected.</em>
          </h2>
          <p className="text-muted-foreground mb-7 text-balance">
            Get notified about upcoming Sync Up! editions and new spaces — no spam, only intentional updates.
          </p>
          {status === "success" ? (
            <p className="text-gold font-medium">You're now subscribed to Pagu updates.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-background/80 border border-border rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-ring"
                disabled={status === "submitting"}
              />
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="rounded-full"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </span>
                ) : (
                  "Stay connected"
                )}
              </Button>
            </form>
          )}
          {status === "error" && errorMsg && (
            <p className="text-sm text-destructive mt-3">{errorMsg}</p>
          )}
          <a
            href="https://www.instagram.com/pagucollective/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mt-6 transition-colors"
          >
            <Instagram className="h-4 w-4" /> Follow us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
