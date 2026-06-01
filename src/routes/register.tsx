import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail, Phone, ShieldCheck, Info } from "lucide-react";
import {
  issueCode,
  verifyCode,
  getCooldownRemaining,
  clearPending,
  RESEND_COOLDOWN_MS,
  type AuthMethod,
} from "@/lib/auth-mock";
import { isProfileComplete, signIn } from "@/lib/session-mock";
import { isOnboardingComplete } from "@/lib/onboarding-mock";
import { VerifyStep } from "@/components/auth/verify-step";
import { trackToSheet } from "@/lib/sheets";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — Pagu" },
      {
        name: "description",
        content:
          "Join the Pagu community. Curated, safe spaces for FLINTA* people.",
      },
    ],
  }),
  component: RegisterPage,
});

const emailSchema = z.string().trim().email();
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{6,14}$/);
const nameSchema = z.string().trim().min(1).max(100);

type Step = "request" | "verify";

type Errors = {
  name?: string;
  identifier?: string;
  referral?: string;
};

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("request");
  const [method, setMethod] = useState<AuthMethod>("email");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [referral, setReferral] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [tipOpen, setTipOpen] = useState(false);

  // verify state
  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [activeIdentifier, setActiveIdentifier] = useState("");
  const [activeMethod, setActiveMethod] = useState<AuthMethod>("email");

  useEffect(() => {
    if (step !== "verify") return;
    const tick = () => setCooldown(Math.ceil(getCooldownRemaining() / 1000));
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [step]);

  const isEmail = method === "email";

  function validate(): Errors {
    const next: Errors = {};
    if (!nameSchema.safeParse(name).success) {
      next.name = "Please enter your name.";
    }
    const idValue = identifier.trim();
    const idOk = isEmail
      ? emailSchema.safeParse(idValue).success
      : phoneSchema.safeParse(idValue).success;
    if (!idOk) {
      next.identifier = isEmail
        ? "Please enter a valid email address."
        : "Please enter a valid phone number.";
    }
    const refValue = referral.trim();
    if (!refValue) {
      next.referral = "Please enter a referral email.";
    } else if (!emailSchema.safeParse(refValue).success) {
      next.referral = "Please enter a valid referral email.";
    }
    return next;
  }

  function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const value = identifier.trim();
    const result = issueCode(method, value);
    if (!result.ok) {
      toast.message("Please wait a moment before requesting another code.");
      return;
    }
    setActiveIdentifier(value);
    setActiveMethod(method);
    setCode("");
    setVerifyError(null);
    setStep("verify");
  }

  function handleVerify(e?: React.FormEvent) {
    e?.preventDefault();
    if (code.length !== 5) return;
    const result = verifyCode(code);
    if (result === "ok") {
      const user = signIn({ name, method: activeMethod, identifier: activeIdentifier });
      if (activeMethod === "email") {
        trackToSheet({
          sheet: "User Registrations",
          values: [activeIdentifier, "Platform Registration"],
        });
      }
      if (isProfileComplete(user)) {
        navigate({ to: "/profile" });
      } else if (isOnboardingComplete(user.identifier)) {
        navigate({ to: "/profile-setup" });
      } else {
        navigate({ to: "/onboarding" });
      }
      return;
    }
    setVerifyError(
      "The login details are not valid or the code has expired. Please try again.",
    );
  }

  function handleResend() {
    const result = issueCode(activeMethod, activeIdentifier);
    if (!result.ok) return;
    setCode("");
    setVerifyError(null);
    setCooldown(Math.ceil(RESEND_COOLDOWN_MS / 1000));
    toast.success("A new code has been sent. It may take a few minutes to arrive.");
  }

  function handleBack() {
    clearPending();
    setStep("request");
    setCode("");
    setVerifyError(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          {step === "request" ? (
            <>
              <div className="text-center mb-8">
                <h1 className="font-display text-4xl mb-3">Join Pagu</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  A curated FLINTA* community. We take time to welcome each
                  person intentionally.
                </p>
              </div>

              <form
                onSubmit={handleRequest}
                className="space-y-5 bg-card border border-border/60 rounded-2xl p-6 shadow-soft"
              >
                {/* Name */}
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder="Your name"
                    className={`mt-2 w-full bg-input/50 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60 ${
                      errors.name ? "border-destructive" : "border-border"
                    }`}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="mt-2 text-xs text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Method tabs */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-full text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("email");
                      if (errors.identifier)
                        setErrors({ ...errors, identifier: undefined });
                    }}
                    className={`py-2 rounded-full inline-flex items-center justify-center gap-1.5 transition-colors ${
                      isEmail ? "bg-background shadow-soft" : "text-muted-foreground"
                    }`}
                  >
                    <Mail className="h-3.5 w-3.5" /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("phone");
                      if (errors.identifier)
                        setErrors({ ...errors, identifier: undefined });
                    }}
                    className={`py-2 rounded-full inline-flex items-center justify-center gap-1.5 transition-colors ${
                      !isEmail ? "bg-background shadow-soft" : "text-muted-foreground"
                    }`}
                  >
                    <Phone className="h-3.5 w-3.5" /> Phone
                  </button>
                </div>

                {/* Identifier */}
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">
                    {isEmail ? "Email" : "Phone number"}
                  </label>
                  <input
                    key={method}
                    type={isEmail ? "email" : "tel"}
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errors.identifier)
                        setErrors({ ...errors, identifier: undefined });
                    }}
                    inputMode={isEmail ? "email" : "tel"}
                    autoComplete={isEmail ? "email" : "tel"}
                    placeholder={isEmail ? "you@example.com" : "+49 151 234 56789"}
                    className={`mt-2 w-full bg-input/50 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60 ${
                      errors.identifier ? "border-destructive" : "border-border"
                    }`}
                    aria-invalid={!!errors.identifier}
                  />
                  {errors.identifier && (
                    <p className="mt-2 text-xs text-destructive">
                      {errors.identifier}
                    </p>
                  )}
                </div>

                {/* Referral */}
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Referral email
                  </label>
                  <input
                    type="email"
                    value={referral}
                    onChange={(e) => {
                      setReferral(e.target.value);
                      if (errors.referral)
                        setErrors({ ...errors, referral: undefined });
                    }}
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Email of a member who invited you"
                    className={`mt-2 w-full bg-input/50 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60 ${
                      errors.referral ? "border-destructive" : "border-border"
                    }`}
                    aria-invalid={!!errors.referral}
                  />
                  {errors.referral && (
                    <p className="mt-2 text-xs text-destructive">
                      {errors.referral}
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <ShieldCheck className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">
                      Profile subject to approval.
                    </strong>{" "}
                    We review every request to keep our spaces safe and
                    intentional for FLINTA* people. We'll get back to you within
                    a few days.
                  </p>
                </div>

                {/* CTA with tooltip */}
                <TooltipProvider delayDuration={150}>
                  <Tooltip open={tipOpen} onOpenChange={setTipOpen}>
                    <div className="relative flex items-center gap-2">
                      <Button
                        type="submit"
                        variant="hero"
                        size="lg"
                        className="w-full"
                      >
                        Request access code
                      </Button>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label="Why do we ask this?"
                          onClick={() => setTipOpen((v) => !v)}
                          onMouseEnter={() => setTipOpen(true)}
                          onMouseLeave={() => setTipOpen(false)}
                          onFocus={() => setTipOpen(true)}
                          onBlur={() => setTipOpen(false)}
                          className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                    </div>
                    <TooltipContent
                      side="top"
                      align="end"
                      className="max-w-64 rounded-xl bg-card text-foreground border border-gold/30 shadow-md text-xs leading-relaxed p-3"
                    >
                      To keep Pagu safe, registration and login use 2FA — a
                      two-factor authentication method. We'll send a one-time
                      code to your email or phone so only you can continue.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <p className="text-center text-sm text-muted-foreground">
                  Already a member?{" "}
                  <Link to="/login" className="text-gold hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <VerifyStep
              method={activeMethod}
              identifier={activeIdentifier}
              code={code}
              setCode={(c) => {
                setCode(c);
                if (verifyError) setVerifyError(null);
              }}
              error={verifyError}
              cooldown={cooldown}
              onSubmit={handleVerify}
              onResend={handleResend}
              onBack={handleBack}
              backLabel="Go back and edit your details"
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
