import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FuturePlaygroundLanding } from "@/components/future-playground/landing";

export const Route = createFileRoute("/future-playground")({
  head: () => ({
    meta: [
      { title: "Future Playground — Pagu Theme Preview" },
      {
        name: "description",
        content:
          "Internal preview of the Future Playground visual direction applied across the Pagu landing experience.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: FuturePlaygroundPreview,
});

function FuturePlaygroundPreview() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <PreviewBanner />
      <main className="flex-1">
        <FuturePlaygroundLanding />
      </main>
      <Footer />
    </div>
  );
}

function PreviewBanner() {
  return (
    <div className="border-b border-gold/30 bg-gold/10">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-3 flex items-center gap-3 text-xs sm:text-sm flex-wrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gold text-gold-foreground font-semibold text-[11px]">
          Theme Preview
        </span>
        <p className="text-foreground/80">
          Future Playground · now live on the main landing page.
        </p>
        <Link
          to="/"
          className="ml-auto underline underline-offset-4 text-foreground/70 hover:text-foreground"
        >
          Go to /
        </Link>
      </div>
    </div>
  );
}
