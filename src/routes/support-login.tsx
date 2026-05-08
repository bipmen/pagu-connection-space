import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/support-login")({
  head: () => ({
    meta: [
      { title: "Report a problem — Pagu" },
      {
        name: "description",
        content: "Tell us what happened so we can help you access your Pagu account.",
      },
    ],
  }),
  component: SupportLoginPage,
});

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
  // Mock submission — to be wired to an email backend later.
  if (import.meta.env.DEV) {
    console.info("[pagu support] new report:", payload);
  }
  await new Promise((r) => setTimeout(r, 400));
  return { ok: true as const };
}

function SupportLoginPage() {
  const navigate = useNavigate();
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
      navigate({ to: "/support-thank-you" });
    } finally {
      setSubmitting(false);
    }
  }

  const remaining = MAX_MESSAGE - message.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl mb-3">Tell us what happened</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              If you're having trouble logging in or registering, send us a message
              and we'll help you as soon as possible.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-card border border-border/60 rounded-2xl p-6 shadow-soft"
            noValidate
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
                className={`mt-2 w-full bg-input/50 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition-colors ${
                  errors.name ? "border-destructive" : "border-border"
                }`}
                placeholder="Your name"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="mt-2 text-xs text-destructive">{errors.name}</p>
              )}
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
                className={`mt-2 w-full bg-input/50 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition-colors ${
                  errors.email ? "border-destructive" : "border-border"
                }`}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="mt-2 text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                What happened?
              </label>
              <textarea
                value={message}
                onChange={(e) => {
                  const v = e.target.value.slice(0, MAX_MESSAGE);
                  setMessage(v);
                  if (errors.message)
                    setErrors({ ...errors, message: undefined });
                }}
                rows={5}
                maxLength={MAX_MESSAGE}
                className={`mt-2 w-full bg-input/50 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-ring transition-colors resize-none ${
                  errors.message ? "border-destructive" : "border-border"
                }`}
                placeholder="Tell us what went wrong..."
                aria-invalid={!!errors.message}
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                {errors.message ? (
                  <p className="text-destructive">{errors.message}</p>
                ) : (
                  <span className="text-muted-foreground">
                    We read every message.
                  </span>
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
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
