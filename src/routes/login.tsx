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
              <button type="button" className="py-2 rounded-full bg-background shadow-soft inline-flex items-center justify-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</button>
              <button type="button" className="py-2 rounded-full text-muted-foreground inline-flex items-center justify-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Phone</button>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Email or phone</label>
              <input type="text" className="mt-2 w-full bg-input/50 border border-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-ring" placeholder="you@example.com" />
            </div>
            <p className="text-xs text-muted-foreground">We'll send you a 2FA code to sign in. No passwords required.</p>
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
