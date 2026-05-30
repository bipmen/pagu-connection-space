import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { EventsSection } from "@/components/sections/events-section";

export const metadata: Metadata = {
  title: "Events - Sync Up! by Pagu",
  description:
    "Sync Up! - Pagu's signature event format for meaningful FLINTA* connections in Cologne.",
  openGraph: {
    title: "Sync Up! Events",
    description: "Curated speed-friendship and connection rounds for FLINTA* people.",
  },
};

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-12">
        <EventsSection />
      </main>
      <SiteFooter />
    </div>
  );
}
