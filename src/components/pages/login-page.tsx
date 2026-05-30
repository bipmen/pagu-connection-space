"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

type Step = "request" | "verify";

export function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [method, setMethod] = useState<AuthMethod>("email");
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState<string | null>(null);
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

  function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const value = identifier.trim();
    const parsed = isEmail ? emailSchema.safeParse(value) : phoneSchema.safeParse(value);
    if (!parsed.success) {
      setError(
        isEmail ? "Please enter a valid email address." : "Please enter a valid phone number.",
      );
      return;
    }

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
      router.push("/profile");
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
            <RequestStep
              method={method}
              setMethod={(value) => {
                setMethod(value);
                setError(null);
              }}
              identifier={identifier}
              setIdentifier={(value) => {
                setIdentifier(value);
                if (error) setError(null);
              }}
              error={error}
              tipOpen={tipOpen}
              setTipOpen={setTipOpen}
              onSubmit={handleSendCode}
            />
          ) : (
            <NextVerifyStep
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

function RequestStep(props: {
  method: AuthMethod;
  setMethod: (method: AuthMethod) => void;
  identifier: string;
  setIdentifier: (value: string) => void;
  error: string | null;
  tipOpen: boolean;
  setTipOpen: (value: boolean) => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  const { method, setMethod, identifier, setIdentifier, error, tipOpen, setTipOpen, onSubmit } =
    props;
  const isEmail = method === "email";

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="mb-3 font-display text-4xl">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to continue with the community.</p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-border/60 bg-card p-6 shadow-soft"
      >
        <div className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1 text-xs">
          <button
            type="button"
            onClick={() => setMethod("email")}
            className={`inline-flex items-center justify-center gap-1.5 rounded-full py-2 transition-colors ${
              isEmail ? "bg-background shadow-soft" : "text-muted-foreground"
            }`}
          >
            <Mail className="h-3.5 w-3.5" /> Email
          </button>
          <button
            type="button"
            onClick={() => setMethod("phone")}
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
            onChange={(e) => setIdentifier(e.target.value)}
            inputMode={isEmail ? "email" : "tel"}
            autoComplete={isEmail ? "email" : "tel"}
            className={`mt-2 w-full rounded-lg border bg-input/50 px-4 py-3 outline-none transition-colors focus:ring-2 focus:ring-ring ${
              error ? "border-destructive" : "border-border"
            }`}
            placeholder={isEmail ? "you@example.com" : "+49 151 234 56789"}
            aria-invalid={!!error}
            aria-describedby={error ? "id-error" : undefined}
          />
          {error && (
            <p id="id-error" className="mt-2 text-xs text-destructive">
              {error}
            </p>
          )}
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          We&apos;ll send you a{" "}
          <Popover open={tipOpen} onOpenChange={setTipOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                onMouseEnter={() => setTipOpen(true)}
                onMouseLeave={() => setTipOpen(false)}
                onFocus={() => setTipOpen(true)}
                onBlur={() => setTipOpen(false)}
                className="cursor-help text-gold underline decoration-dotted underline-offset-4 transition-colors hover:text-gold/80"
              >
                one-time verification code
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="start"
              className="w-64 border-gold/30 text-xs leading-relaxed shadow-md animate-in fade-in-0 zoom-in-95"
            >
              <p className="mb-1 font-medium text-foreground">What is 2FA?</p>
              <p className="text-muted-foreground">
                2FA (two-factor authentication) is an extra security step. We send a code to your{" "}
                {isEmail ? "email" : "phone"} so only you can access your account.
              </p>
            </PopoverContent>
          </Popover>{" "}
          to sign in, no password needed.
        </p>

        <Button type="submit" variant="hero" size="lg" className="w-full">
          Send Code
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/register" className="text-gold hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </>
  );
}

function NextVerifyStep(props: {
  method: AuthMethod;
  identifier: string;
  code: string;
  setCode: (value: string) => void;
  error: string | null;
  cooldown: number;
  onSubmit: (event?: React.FormEvent) => void;
  onResend: () => void;
  onBack: () => void;
  backLabel?: string;
}) {
  const {
    method,
    identifier,
    code,
    setCode,
    error,
    cooldown,
    onSubmit,
    onResend,
    onBack,
    backLabel = "Try a different email or phone number",
  } = props;
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
            {backLabel}
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
