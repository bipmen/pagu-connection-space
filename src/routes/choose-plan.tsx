import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateCurrentUser, useCurrentUser } from "@/lib/session-mock";
import { Check, Sparkles, Flower2, Crown } from "lucide-react";

export const Route = createFileRoute("/choose-plan")({
  head: () => ({
    meta: [
      { title: "Choose your plan — Pagu" },
      { name: "description", content: "Pick the plan that fits your Pagu journey." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChoosePlanPage,
});

const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: "€0",
    priceLabel: "Forever free",
    description: "For exploring the community",
    icon: <Flower2 className="h-5 w-5" />,
    benefits: [
      "Basic profile",
      "Access to selected community updates",
      "Limited event discovery",
    ],
    cta: "Choose Free",
  },
  {
    id: "basic" as const,
    name: "Basic",
    price: "Coming soon",
    priceLabel: "Monthly plan",
    description: "For active community participation",
    icon: <Sparkles className="h-5 w-5" />,
    benefits: [
      "Full event discovery",
      "Join / request community events",
      "Discover community spaces",
      "Basic member visibility",
    ],
    cta: "Choose Basic",
    recommended: true,
  },
  {
    id: "premium" as const,
    name: "Premium",
    price: "Coming soon",
    priceLabel: "Monthly plan",
    description: "For deeper connection",
    icon: <Crown className="h-5 w-5" />,
    benefits: [
      "Priority access to selected events",
      "Enhanced discovery features",
      "More visibility in community matching",
      "Early access to new features",
    ],
    cta: "Choose Premium",
  },
];

function ChoosePlanPage() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(planId: string) {
    setSelected(planId);
  }

  function handleContinue() {
    if (!selected) return;
    updateCurrentUser({ selectedPlan: selected as "free" | "basic" | "premium" });
    navigate({ to: "/profile" });
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-5 py-20">
          <Card className="max-w-md w-full text-center">
            <CardContent className="p-8 space-y-4">
              <h1 className="text-2xl font-semibold">Sign in first</h1>
              <p className="text-muted-foreground">
                You need to be logged in to choose a plan.
              </p>
              <Button asChild variant="hero">
                <Link to="/login">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-5xl px-5 py-8 lg:py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto h-px w-16 bg-gold/60 mb-4" />
            <h1 className="font-display text-3xl md:text-4xl">Choose your plan</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Pick what feels right. You can always change it later — no pressure.
            </p>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan) => {
              const isSelected = selected === plan.id;
              const isRecommended = plan.recommended;
              return (
                <Card
                  key={plan.id}
                  onClick={() => handleSelect(plan.id)}
                  className={`relative cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                    isSelected
                      ? "border-gold shadow-glow"
                      : isRecommended
                      ? "border-gold/40"
                      : "border-border/60 hover:border-gold/30"
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="secondary" className="bg-gold text-gold-foreground font-medium text-xs">
                        Recommended
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6 space-y-5">
                    {/* Plan header */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gold">
                        {plan.icon}
                        <h2 className="font-display text-xl font-medium">{plan.name}</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="space-y-0.5">
                      <p className="text-2xl font-display font-medium">{plan.price}</p>
                      <p className="text-xs text-muted-foreground">{plan.priceLabel}</p>
                    </div>

                    {/* Benefits */}
                    <ul className="space-y-2">
                      {plan.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Selection indicator */}
                    <div className="pt-1">
                      <Button
                        variant={isSelected ? "hero" : "outlineGold"}
                        size="lg"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(plan.id);
                        }}
                      >
                        {isSelected ? "Selected" : plan.cta}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Continue action */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <Button
              variant="hero"
              size="lg"
              className="w-full max-w-xs"
              disabled={!selected}
              onClick={handleContinue}
            >
              Continue
            </Button>
            <p className="text-xs text-muted-foreground text-center max-w-sm">
              Paid plans are placeholders for now — you will not be charged.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
