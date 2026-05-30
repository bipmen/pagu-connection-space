import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Contact - Pagu",
  description: "Get in touch with the Pagu collective. Collaborate, propose ideas, say hello.",
  openGraph: {
    title: "Contact Pagu",
    description: "Our inbox is always open.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-12">
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
