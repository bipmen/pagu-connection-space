import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AboutSection } from "@/components/sections/about-section";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ContactSection } from "@/components/sections/contact-section";
import { EventsSection } from "@/components/sections/events-section";
import { MailingSection } from "@/components/sections/mailing-section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pagu — FLINTA* community in Cologne" },
      { name: "description", content: "Pagu is a FLINTA*-led collective in Cologne creating intentional, curated spaces for connection beyond algorithms." },
      { property: "og:title", content: "Pagu — Connection beyond algorithms" },
      { property: "og:description", content: "A FLINTA*-led collective creating curated events and meaningful encounters in Cologne." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroCarousel />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
        <EventsSection />
        <MailingSection />
      </main>
      <Footer />
    </div>
  );
}
