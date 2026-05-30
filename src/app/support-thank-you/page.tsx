import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Thank you - Pagu",
  description: "Thank you for reaching out to Pagu support.",
};

export default function SupportThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-20">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-8 h-px w-16 bg-gold/60" />
          <h1 className="mb-4 font-display text-4xl md:text-5xl">Thank you for reaching out</h1>
          <p className="mb-8 text-base leading-relaxed text-muted-foreground">
            We received your message and will contact you soon to help solve the issue as quickly
            as possible.
          </p>
          <Button asChild variant="hero" size="lg">
            <Link href="/">Back to homepage</Link>
          </Button>
          <div className="mx-auto mt-10 h-px w-16 bg-gold/60" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
