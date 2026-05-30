import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ContactSection } from "@/components/sections/contact-section";
import { EventsSection } from "@/components/sections/events-section";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { MailingSection } from "@/components/sections/mailing-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroCarousel />
        <TestimonialsSection />
        <ContactSection />
        <EventsSection />
        <MailingSection />
      </main>
      <SiteFooter />
    </div>
  );
}
