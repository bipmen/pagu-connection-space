import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Pagu" },
      { name: "description", content: "Your Pagu community space." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-5 py-20">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto h-px w-16 bg-gold/60 mb-8" />
          <h1 className="font-display text-4xl md:text-5xl mb-4">
            Welcome to your Pagu profile
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Your community space is being prepared.
          </p>
          <div className="mx-auto h-px w-16 bg-gold/60 mt-8" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
