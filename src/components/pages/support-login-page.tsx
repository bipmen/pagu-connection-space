"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

const MAX_MESSAGE = 500;

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .email("Please enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(1, "Please describe the problem.")
    .max(MAX_MESSAGE, `Your message can be up to ${MAX_MESSAGE} characters.`),
});

type Errors = Partial<Record<"name" | "email" | "message", string>>;

async function submitSupportRequest(payload: {
  name: string;
  email: string;
  message: string;
}) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[pagu support] new report:", payload);
  }
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { ok: true as const };
}

export function SupportLoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, message });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await submitSupportRequest(parsed.data);
      router.push("/support-thank-you");
    } finally {
      setSubmitting(false);
    }
  }

  const remaining = MAX_MESSAGE - message.length;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-3 font-display text-4xl">Tell us what happened</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              If you&apos;re having trouble logging in or registering, send us a message and
              we&apos;ll help you as soon as possible.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-border/60 bg-card p-6 shadow-soft"
            noValidate
          >
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                className={`mt-2 w-full rounded-lg border bg-input/50 px-4 py-3 outline-none transition-colors focus:ring-2 focus:ring-ring ${
                  errors.name ? "border-destructive" : "border-border"
                }`}
                placeholder="Your name"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="mt-2 text-xs text-destructive">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Email for contact
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                inputMode="email"
                autoComplete="email"
                className={`mt-2 w-full rounded-lg border bg-input/50 px-4 py-3 outline-none transition-colors focus:ring-2 focus:ring-ring ${
                  errors.email ? "border-destructive" : "border-border"
                }`}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="mt-2 text-xs text-destructive">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                What happened?
              </label>
              <textarea
                value={message}
                onChange={(e) => {
                  const value = e.target.value.slice(0, MAX_MESSAGE);
                  setMessage(value);
                  if (errors.message) setErrors({ ...errors, message: undefined });
                }}
                rows={5}
                maxLength={MAX_MESSAGE}
                className={`mt-2 w-full resize-none rounded-lg border bg-input/50 px-4 py-3 outline-none transition-colors focus:ring-2 focus:ring-ring ${
                  errors.message ? "border-destructive" : "border-border"
                }`}
                placeholder="Tell us what went wrong..."
                aria-invalid={!!errors.message}
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                {errors.message ? (
                  <p className="text-destructive">{errors.message}</p>
                ) : (
                  <span className="text-muted-foreground">We read every message.</span>
                )}
                <span
                  className={`tabular-nums ${
                    remaining < 0 ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {message.length} / {MAX_MESSAGE}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send message"}
            </Button>

            <div className="flex justify-center pt-1">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
