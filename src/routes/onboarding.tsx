import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  ShieldCheck,
  Users,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Lock,
} from "lucide-react";
import { useCurrentUser } from "@/lib/session-mock";
import {
  EMPTY_ONBOARDING,
  getOnboarding,
  saveOnboarding,
  type OnboardingState,
} from "@/lib/onboarding-mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to Pagu — Onboarding" },
      {
        name: "description",
        content:
          "A short, intentional welcome into the Pagu community before you complete your profile.",
      },
    ],
  }),
  component: OnboardingPage,
});

const VALUES = [
  {
    icon: Heart,
    title: "Respect & consent",
    body: "Every interaction begins with consent. We honour each other's pace, words, and boundaries.",
  },
  {
    icon: ShieldCheck,
    title: "FLINTA* safety",
    body: "Pagu exists as a safer space for FLINTA* people. Safety is a shared, active practice.",
  },
  {
    icon: Users,
    title: "Inclusion & mutual care",
    body: "We celebrate difference and look out for one another, especially those most often overlooked.",
  },
  {
    icon: Sparkles,
    title: "Community accountability",
    body: "We take responsibility for our impact and welcome repair when harm happens.",
  },
  {
    icon: ShieldCheck,
    title: "Anti-discrimination",
    body: "Racism, transphobia, ableism, queerphobia and other forms of discrimination have no place here.",
  },
  {
    icon: Lock,
    title: "Privacy & trust",
    body: "What is shared in Pagu stays in Pagu. Trust is the foundation of this community.",
  },
];

const RULES = [
  "Respect everyone's consent and boundaries — online and in person.",
  "No harassment, hate speech, discrimination or fetishization of any kind.",
  "Never screenshot or share private member information without explicit consent.",
  "No spam, scams, self-promotion at scale, or impersonation.",
  "Events and interactions must remain safe, sober-friendly, and respectful.",
  "Violations may lead to a warning, suspension, or removal from the community.",
];

type StepId = "values" | "rules" | "flinta" | "reflection";

const STEPS: { id: StepId; label: string }[] = [
  { id: "values", label: "Our values" },
  { id: "rules", label: "Rules & policies" },
  { id: "flinta", label: "FLINTA* space" },
  { id: "reflection", label: "Reflection" },
];

const MIN_ANSWER = 40;

function OnboardingPage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const identifier = user?.identifier ?? "";

  const [state, setState] = useState<OnboardingState>(EMPTY_ONBOARDING);
  const [stepIndex, setStepIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!identifier) return;
    setState(getOnboarding(identifier));
    setHydrated(true);
  }, [identifier]);

  // Persist on every change.
  useEffect(() => {
    if (!hydrated || !identifier) return;
    saveOnboarding(identifier, state);
  }, [state, identifier, hydrated]);

  const currentStep = STEPS[stepIndex];

  const stepValid = useMemo(() => {
    switch (currentStep.id) {
      case "values":
        return state.valuesAccepted;
      case "rules":
        return state.rulesOpened && state.rulesAccepted;
      case "flinta":
        return state.flintaConfirmed;
      case "reflection":
        return (
          state.answers.contribution.trim().length >= MIN_ANSWER &&
          state.answers.attractedToPagu.trim().length >= MIN_ANSWER &&
          state.answers.communityChallenges.trim().length >= MIN_ANSWER
        );
    }
  }, [currentStep.id, state]);

  const isLast = stepIndex === STEPS.length - 1;
  const progressPct = Math.round(((stepIndex + (stepValid ? 1 : 0)) / STEPS.length) * 100);

  function handleNext() {
    if (!stepValid) return;
    if (isLast) {
      const next = { ...state, onboardingCompleted: true };
      setState(next);
      saveOnboarding(identifier, next);
      navigate({ to: "/profile-setup" });
      return;
    }
    setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setStepIndex((i) => Math.max(0, i - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-5 py-10 md:py-16">
        <div className="mx-auto w-full max-w-3xl">
          {/* Intro */}
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
              Joining Pagu
            </p>
            <h1 className="font-display text-3xl md:text-4xl mb-3">
              A few intentional steps
            </h1>
            <p className="text-muted-foreground text-sm md:text-base text-balance max-w-xl mx-auto">
              Pagu is a trust-based FLINTA* community. Take a moment to read,
              reflect, and confirm — so the space stays safe and aligned for
              everyone.
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-2 mb-3">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1.5 text-[10px] md:text-xs text-center",
                    i === stepIndex ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "h-7 w-7 rounded-full grid place-content-center text-xs border transition-colors",
                      i < stepIndex
                        ? "bg-gold text-gold-foreground border-gold"
                        : i === stepIndex
                          ? "border-gold text-gold"
                          : "border-border text-muted-foreground",
                    )}
                  >
                    {i < stepIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className="hidden sm:block">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-gold transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Active step */}
          <div className="rounded-3xl border border-border/60 bg-card shadow-soft">
            <StepShell>
              {currentStep.id === "values" && (
                <ValuesStep
                  accepted={state.valuesAccepted}
                  onToggle={(v) => setState({ ...state, valuesAccepted: v })}
                />
              )}
              {currentStep.id === "rules" && (
                <RulesStep
                  opened={state.rulesOpened}
                  accepted={state.rulesAccepted}
                  onOpen={() => setState({ ...state, rulesOpened: true })}
                  onAccept={(v) => setState({ ...state, rulesAccepted: v })}
                />
              )}
              {currentStep.id === "flinta" && (
                <FlintaStep
                  confirmed={state.flintaConfirmed}
                  onToggle={(v) => setState({ ...state, flintaConfirmed: v })}
                />
              )}
              {currentStep.id === "reflection" && (
                <ReflectionStep
                  answers={state.answers}
                  onChange={(answers) => setState({ ...state, answers })}
                />
              )}
            </StepShell>
          </div>

          {/* Nav */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={stepIndex === 0}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Step {stepIndex + 1} of {STEPS.length}
            </p>
            <Button
              type="button"
              variant="hero"
              onClick={handleNext}
              disabled={!stepValid}
              title={!stepValid ? "Please complete this step to continue" : undefined}
            >
              {isLast ? "Complete onboarding" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          {!stepValid && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Finish this step to unlock the next one.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StepShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-full shrink-0 p-6 md:p-10">{children}</div>
  );
}

function ValuesStep({
  accepted,
  onToggle,
}: {
  accepted: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">Our values</h2>
      <p className="text-sm text-muted-foreground mb-6">
        These are the principles that shape every space in Pagu.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {VALUES.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="border-border/60">
            <CardContent className="p-4 flex gap-3">
              <div className="h-9 w-9 shrink-0 rounded-full bg-gold/10 text-gold grid place-content-center">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <label className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 cursor-pointer">
        <Checkbox
          checked={accepted}
          onCheckedChange={(v) => onToggle(v === true)}
          className="mt-0.5"
        />
        <span className="text-sm leading-relaxed">
          I understand and align with these values.
        </span>
      </label>
    </div>
  );
}

function RulesStep({
  opened,
  accepted,
  onOpen,
  onAccept,
}: {
  opened: boolean;
  accepted: boolean;
  onOpen: () => void;
  onAccept: (v: boolean) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">Rules & policies</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Please open and read the community rules before agreeing.
      </p>

      {!opened ? (
        <button
          type="button"
          onClick={onOpen}
          className="w-full text-left rounded-2xl border border-dashed border-border p-6 hover:border-gold hover:bg-gold/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gold/10 text-gold grid place-content-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Open the community rules</p>
              <p className="text-xs text-muted-foreground">
                Tap to read before continuing.
              </p>
            </div>
          </div>
        </button>
      ) : (
        <div className="rounded-2xl border border-border bg-background/50 p-5">
          <div className="flex items-center gap-2 text-xs text-gold mb-3">
            <CheckCircle2 className="h-4 w-4" /> Rules opened
          </div>
          <ol className="space-y-3 text-sm leading-relaxed list-decimal pl-5">
            {RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </div>
      )}

      <label
        className={cn(
          "mt-6 flex items-start gap-3 p-4 rounded-xl border transition-colors",
          opened
            ? "bg-primary/5 border-primary/20 cursor-pointer"
            : "bg-muted/40 border-border opacity-60 cursor-not-allowed",
        )}
      >
        <Checkbox
          checked={accepted}
          onCheckedChange={(v) => onAccept(v === true)}
          disabled={!opened}
          className="mt-0.5"
        />
        <span className="text-sm leading-relaxed">
          I have read and agree to the community rules and policies.
        </span>
      </label>
      {!opened && (
        <p className="mt-2 text-xs text-muted-foreground">
          Please open the rules above to enable this option.
        </p>
      )}
    </div>
  );
}

function FlintaStep({
  confirmed,
  onToggle,
}: {
  confirmed: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">A FLINTA* space</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Pagu is built for FLINTA* people. Please take a moment to read what
        that means.
      </p>
      <div className="rounded-2xl bg-gradient-to-br from-gold/10 to-primary/5 border border-gold/20 p-5 md:p-6">
        <p className="text-sm md:text-base leading-relaxed">
          <strong>FLINTA*</strong> stands for{" "}
          <em>women, lesbians, intersex, non-binary, trans and agender</em>{" "}
          people. Pagu exists to create safer, more intentional community
          connection for people whose identities have historically been excluded
          or unsafe in mainstream spaces.
        </p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          The asterisk (*) is an open invitation to everyone whose identity
          aligns with these experiences.
        </p>
      </div>
      <label className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 cursor-pointer">
        <Checkbox
          checked={confirmed}
          onCheckedChange={(v) => onToggle(v === true)}
          className="mt-0.5"
        />
        <span className="text-sm leading-relaxed">
          I confirm that I am a FLINTA* person.
        </span>
      </label>
    </div>
  );
}

function ReflectionStep({
  answers,
  onChange,
}: {
  answers: { contribution: string; attractedToPagu: string; communityChallenges: string };
  onChange: (a: typeof answers) => void;
}) {
  const fields: {
    key: keyof typeof answers;
    label: string;
    placeholder: string;
  }[] = [
    {
      key: "contribution",
      label: "How do you hope to contribute to this community?",
      placeholder:
        "Share what you'd love to bring — your energy, skills, presence, curiosity…",
    },
    {
      key: "attractedToPagu",
      label: "What attracted you to Pagu?",
      placeholder: "Tell us what drew you here.",
    },
    {
      key: "communityChallenges",
      label:
        "In your opinion, what are some of the main challenges in today's community spaces that need to be addressed?",
      placeholder: "Reflect openly — there is no right answer.",
    },
  ];
  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">A short reflection</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Three open questions to help us welcome you intentionally. There is no
        right answer — just write honestly.
      </p>
      <div className="space-y-5">
        {fields.map((f) => {
          const value = answers[f.key];
          const ok = value.trim().length >= MIN_ANSWER;
          return (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-2">{f.label}</label>
              <Textarea
                value={value}
                onChange={(e) => onChange({ ...answers, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                rows={4}
                className="resize-none"
              />
              <div className="mt-1.5 flex items-center justify-between text-xs">
                <span
                  className={cn(
                    "text-muted-foreground",
                    ok && "text-gold",
                  )}
                >
                  {ok ? "Looks good" : `At least ${MIN_ANSWER} characters`}
                </span>
                <span className="text-muted-foreground">
                  {value.trim().length}/{MIN_ANSWER}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
