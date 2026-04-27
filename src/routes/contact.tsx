import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactSection } from "@/components/sections/contact-section";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Pagu" },
      { name: "description", content: "Get in touch with the Pagu collective. Collaborate, propose ideas, say hello." },
      { property: "og:title", content: "Contact Pagu" },
      { property: "og:description", content: "Our inbox is always open." },
    ],
  }),
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-12">
        <ContactSection />
      </main>
      <Footer />
    </div>
  ),
});
