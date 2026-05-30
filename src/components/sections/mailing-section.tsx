"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

export function MailingSection() {
  const [sent, setSent] = useState(false);
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
          {sent ? (
            <p className="text-gold font-medium">Thank you 💛 You're on the list.</p>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="flex-1 bg-background/80 border border-border rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit" variant="hero" size="lg" className="rounded-full">Stay connected</Button>
            </form>
          )}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mt-6 transition-colors"
          >
            <Instagram className="h-4 w-4" /> Follow us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
