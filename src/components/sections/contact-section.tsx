"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function ContactSection() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="px-5 lg:px-8 max-w-7xl mx-auto py-20 md:py-28">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Build together</p>
          <h2 className="font-display text-4xl md:text-5xl text-balance leading-tight mb-6">
            Our inbox is <em className="text-gold not-italic">always open.</em>
          </h2>
          <p className="text-muted-foreground leading-relaxed text-balance">
            Pagu is a community project, and we love hearing from the people around it.
            Whether you want to collaborate, share an idea, propose an event, or simply say hello —
            our inbox is always open.
          </p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 shadow-soft space-y-5"
        >
          {sent ? (
            <div className="text-center py-8">
              <div className="h-14 w-14 rounded-full bg-gold/20 mx-auto flex items-center justify-center mb-4">
                <Send className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-display text-2xl mb-2">Message received</h3>
              <p className="text-sm text-muted-foreground">We'll get back to you soon. 💛</p>
            </div>
          ) : (
            <>
              <Field label="Name" placeholder="Your name" />
              <Field label="Email" placeholder="you@example.com" type="email" />
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us what's on your mind..."
                  className="mt-2 w-full bg-input/50 border border-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Send us a message and we'll get back to you soon.
                </p>
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">
                Join the movement
              </Button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full bg-input/50 border border-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60"
      />
    </div>
  );
}
