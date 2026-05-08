import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/support-thank-you")({
  head: () => ({
    meta: [
      { title: "Thank you — Pagu" },
      {
        name: "description",
        content: "Thank you for reaching out to Pagu support.",
      },
    ],
  }),
  component: SupportThankYouPage,
});

function SupportThankYouPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-5 py-20">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto h-px w-16 bg-gold/60 mb-8" />
          <h1 className="font-display text-4xl md:text-5xl mb-4">
            Thank you for reaching out
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-8">
            We received your message and will contact you soon to help solve the
            issue as quickly as possible.
          </p>
          <Button
            variant="hero"
            size="lg"
            onClick={() => navigate({ to: "/" })}
          >
            Back to homepage
          </Button>
          <div className="mx-auto h-px w-16 bg-gold/60 mt-10" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
