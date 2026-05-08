import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { maskIdentifier, type AuthMethod } from "@/lib/auth-mock";

export function VerifyStep(props: {
  method: AuthMethod;
  identifier: string;
  code: string;
  setCode: (v: string) => void;
  error: string | null;
  cooldown: number;
  onSubmit: (e?: React.FormEvent) => void;
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
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl mb-3">Enter your verification code</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We sent a 5-digit code to your {method === "email" ? "email" : "phone"}{" "}
          <span className="text-foreground">{masked}</span>. It may take a few minutes
          to arrive.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 bg-card border border-border/60 rounded-2xl p-6 shadow-soft"
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
              {[0, 1, 2, 3, 4].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className={`h-12 w-12 rounded-lg text-lg border ${
                    error ? "border-destructive" : "border-border"
                  }`}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive text-center">
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
            className="text-sm text-gold hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
          >
            {canResend ? "Send a new code" : `Send a new code in ${cooldown}s`}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </button>
        </div>
      </form>
    </>
  );
}
