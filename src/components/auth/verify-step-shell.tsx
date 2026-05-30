import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { maskIdentifier, type AuthMethod } from "@/lib/auth-mock";

type SupportLinkProps = {
  to: string;
  className?: string;
  children: ReactNode;
};

export type VerifyStepShellProps = {
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
  SupportLinkComponent: (props: SupportLinkProps) => ReactNode;
};

export function VerifyStepShell(props: VerifyStepShellProps) {
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
    SupportLinkComponent,
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
        <SupportLinkComponent to="/support-login" className="text-gold hover:underline">
          Report a problem
        </SupportLinkComponent>
      </div>
    </>
  );
}
