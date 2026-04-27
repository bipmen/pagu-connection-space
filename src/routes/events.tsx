import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EventsSection } from "@/components/sections/events-section";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Sync Up! by Pagu" },
      { name: "description", content: "Sync Up! — Pagu's signature event format for meaningful FLINTA* connections in Cologne." },
      { property: "og:title", content: "Sync Up! Events" },
      { property: "og:description", content: "Curated speed-friendship & connection rounds for FLINTA* people." },
    ],
  }),
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-12">
        <EventsSection />
      </main>
      <Footer />
    </div>
  ),
});
