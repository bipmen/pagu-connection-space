import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FuturePlaygroundLanding } from "@/components/future-playground/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pagu — FLINTA* community in Cologne" },
      {
        name: "description",
        content:
          "Pagu is a FLINTA*-led collective in Cologne creating intentional, curated spaces for connection beyond algorithms.",
      },
      { property: "og:title", content: "Pagu — Connection beyond algorithms" },
      {
        property: "og:description",
        content: "A FLINTA*-led collective creating curated events and meaningful encounters in Cologne.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <FuturePlaygroundLanding />
      </main>
      <Footer />
    </div>
  );
}
