import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Your Profile - Pagu",
  description: "Your Pagu community space.",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-20">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-8 h-px w-16 bg-gold/60" />
          <h1 className="mb-4 font-display text-4xl md:text-5xl">
            Welcome to your Pagu profile
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Your community space is being prepared.
          </p>
          <div className="mx-auto mt-8 h-px w-16 bg-gold/60" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
