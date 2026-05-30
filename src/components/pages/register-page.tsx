"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Info, Mail, Phone, ShieldCheck, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  clearPending,
  getCooldownRemaining,
  issueCode,
  maskIdentifier,
  RESEND_COOLDOWN_MS,
  verifyCode,
  type AuthMethod,
} from "@/lib/auth-mock";

const emailSchema = z.string().trim().email();
const phoneSchema = z.string().trim().regex(/^\+?[1-9]\d{6,14}$/);
const nameSchema = z.string().trim().min(1).max(100);

type Step = "request" | "verify";

type Errors = {
  name?: string;
  identifier?: string;
  referral?: string;
};

export function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [method, setMethod] = useState<AuthMethod>("email");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [referral, setReferral] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [tipOpen, setTipOpen] = useState(false);
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
    const idOk = isEmail ? emailSchema.safeParse(idValue).success : phoneSchema.safeParse(idValue).success;
    if (!idOk) {
      next.identifier = isEmail
        ? "Please enter a valid email address."
        : "Please enter a valid phone number.";
    }

    const referralValue = referral.trim();
    if (!referralValue) {
      next.referral = "Please enter a referral email.";
    } else if (!emailSchema.safeParse(referralValue).success) {
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
      router.push("/pending");
      return;
    }
    setVerifyError("The login details are not valid or the code has expired. Please try again.");
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
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          {step === "request" ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="mb-3 font-display text-4xl">Join Pagu</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  A curated FLINTA* community. We take time to welcome each person intentionally.
                </p>
              </div>

              <form
                onSubmit={handleRequest}
                className="space-y-5 rounded-2xl border border-border/60 bg-card p-6 shadow-soft"
              >
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
                    className={`mt-2 w-full rounded-lg border bg-input/50 px-4 py-3 outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring ${
                      errors.name ? "border-destructive" : "border-border"
                    }`}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="mt-2 text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("email");
                      if (errors.identifier) setErrors({ ...errors, identifier: undefined });
                    }}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-full py-2 transition-colors ${
                      isEmail ? "bg-background shadow-soft" : "text-muted-foreground"
                    }`}
                  >
                    <Mail className="h-3.5 w-3.5" /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("phone");
                      if (errors.identifier) setErrors({ ...errors, identifier: undefined });
                    }}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-full py-2 transition-colors ${
                      !isEmail ? "bg-background shadow-soft" : "text-muted-foreground"
                    }`}
                  >
                    <Phone className="h-3.5 w-3.5" /> Phone
                  </button>
                </div>

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
                      if (errors.identifier) setErrors({ ...errors, identifier: undefined });
                    }}
                    inputMode={isEmail ? "email" : "tel"}
                    autoComplete={isEmail ? "email" : "tel"}
                    placeholder={isEmail ? "you@example.com" : "+49 151 234 56789"}
                    className={`mt-2 w-full rounded-lg border bg-input/50 px-4 py-3 outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring ${
                      errors.identifier ? "border-destructive" : "border-border"
                    }`}
                    aria-invalid={!!errors.identifier}
                  />
                  {errors.identifier && (
                    <p className="mt-2 text-xs text-destructive">{errors.identifier}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Referral email
                  </label>
                  <input
                    type="email"
                    value={referral}
                    onChange={(e) => {
                      setReferral(e.target.value);
                      if (errors.referral) setErrors({ ...errors, referral: undefined });
                    }}
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Email of a member who invited you"
                    className={`mt-2 w-full rounded-lg border bg-input/50 px-4 py-3 outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring ${
                      errors.referral ? "border-destructive" : "border-border"
                    }`}
                    aria-invalid={!!errors.referral}
                  />
                  {errors.referral && (
                    <p className="mt-2 text-xs text-destructive">{errors.referral}</p>
                  )}
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/10 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Profile subject to approval.</strong>{" "}
                    We review every request to keep our spaces safe and intentional for FLINTA*
                    people. We&apos;ll get back to you within a few days.
                  </p>
                </div>

                <TooltipProvider delayDuration={150}>
                  <Tooltip open={tipOpen} onOpenChange={setTipOpen}>
                    <div className="relative flex items-center gap-2">
                      <Button type="submit" variant="hero" size="lg" className="w-full">
                        Request access code
                      </Button>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label="Why do we ask this?"
                          onClick={() => setTipOpen((value) => !value)}
                          onMouseEnter={() => setTipOpen(true)}
                          onMouseLeave={() => setTipOpen(false)}
                          onFocus={() => setTipOpen(true)}
                          onBlur={() => setTipOpen(false)}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors hover:bg-gold/10"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                    </div>
                    <TooltipContent
                      side="top"
                      align="end"
                      className="max-w-64 rounded-xl border border-gold/30 bg-card p-3 text-xs leading-relaxed text-foreground shadow-md"
                    >
                      To keep Pagu safe, registration and login use 2FA, a two-factor
                      authentication method. We&apos;ll send a one-time code to your email or phone
                      so only you can continue.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <p className="text-center text-sm text-muted-foreground">
                  Already a member?{" "}
                  <Link href="/login" className="text-gold hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <RegisterVerifyStep
              method={activeMethod}
              identifier={activeIdentifier}
              code={code}
              setCode={(value) => {
                setCode(value);
                if (verifyError) setVerifyError(null);
              }}
              error={verifyError}
              cooldown={cooldown}
              onSubmit={handleVerify}
              onResend={handleResend}
              onBack={handleBack}
            />
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function RegisterVerifyStep(props: {
  method: AuthMethod;
  identifier: string;
  code: string;
  setCode: (value: string) => void;
  error: string | null;
  cooldown: number;
  onSubmit: (event?: React.FormEvent) => void;
  onResend: () => void;
  onBack: () => void;
}) {
  const { method, identifier, code, setCode, error, cooldown, onSubmit, onResend, onBack } = props;
  const masked = maskIdentifier(method, identifier);
  const canResend = cooldown <= 0;

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="mb-3 font-display text-4xl">Enter your verification code</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We sent a 5-digit code to your {method === "email" ? "email" : "phone"}{" "}
          <span className="text-foreground">{masked}</span>. It may take a few minutes to arrive.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-border/60 bg-card p-6 shadow-soft"
      >
        <div className="flex justify-center py-2">
          <InputOTP
            maxLength={5}
            value={code}
            onChange={setCode}
            onComplete={() => onSubmit()}
            aria-invalid={!!error}
          >
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className={`h-12 w-12 rounded-lg border text-lg ${
                    error ? "border-destructive" : "border-border"
                  }`}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-center text-xs text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="w-full"
          disabled={code.length !== 5}
        >
          {error ? "Try again" : "Verify Code"}
        </Button>

        <div className="flex flex-col items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onResend}
            disabled={!canResend}
            className="text-sm text-gold hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {canResend ? "Send a new code" : `Send a new code in ${cooldown}s`}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Go back and edit your details
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        Having trouble accessing your account?{" "}
        <Link href="/support-login" className="text-gold hover:underline">
          Report a problem
        </Link>
      </div>
    </>
  );
}
