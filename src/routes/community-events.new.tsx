import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Plus, Trash2, Lock, ShieldCheck } from "lucide-react";
import { useCurrentUser } from "@/lib/session-mock";
import {
  EVENT_CATEGORIES,
  EVENT_TYPE_LABEL,
  createEvent,
  type EventCategory,
  type EventType,
} from "@/lib/events-mock";

export const Route = createFileRoute("/community-events/new")({
  head: () => ({
    meta: [
      { title: "Create event — Pagu" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CreateEventPage,
});

const step1Schema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(20).max(2000),
  category: z.enum(EVENT_CATEGORIES),
});
const step2Schema = z.object({
  date: z.string().min(1),
  time: z.string().min(1),
  city: z.string().trim().min(1).max(80),
  location: z.string().trim().min(1).max(200),
  maxAttendees: z.number().int().min(2).max(200),
});

type FormState = {
  title: string;
  description: string;
  category: EventCategory | "";
  date: string;
  time: string;
  city: string;
  location: string;
  maxAttendees: number;
  type: EventType;
  guidelines: boolean;
  questions: string[];
};

function CreateEventPage() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    city: user?.city ?? "",
    location: "",
    maxAttendees: 8,
    type: "request",
    guidelines: false,
    questions: [""],
  });

  if (!user) return <Gate><Lock className="h-6 w-6 text-gold mx-auto mb-4" /><h1 className="font-display text-2xl mb-2">Members only</h1><p className="text-sm text-muted-foreground mb-6">Please sign in to host an event.</p><Button asChild variant="hero" size="lg" className="w-full"><Link to="/login">Sign in</Link></Button></Gate>;

  if (!user.organizer_unlocked) {
    return (
      <Gate>
        <ShieldCheck className="h-6 w-6 text-gold mx-auto mb-4" />
        <h1 className="font-display text-2xl mb-3">Hosting unlocks soon</h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          To host an event, attend at least one official Pagu event first. This keeps the community grounded in real, in-person trust.
        </p>
        <Button asChild variant="hero" size="lg" className="w-full">
          <Link to="/events/community">Discover events</Link>
        </Button>
      </Gate>
    );
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key as string]: "" }));
  }

  function next() {
    if (step === 1) {
      const r = step1Schema.safeParse({
        title: form.title,
        description: form.description,
        category: form.category,
      });
      if (!r.success) {
        const errs: Record<string, string> = {};
        r.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
        setErrors(errs);
        return;
      }
    }
    if (step === 2) {
      const r = step2Schema.safeParse({
        date: form.date,
        time: form.time,
        city: form.city,
        location: form.location,
        maxAttendees: Number(form.maxAttendees),
      });
      if (!r.success) {
        const errs: Record<string, string> = {};
        r.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
        setErrors(errs);
        return;
      }
    }
    if (step === 3) {
      const qs = form.questions.map((q) => q.trim()).filter(Boolean);
      if (qs.length < 1) {
        setErrors({ questions: "Add at least one application question." });
        return;
      }
      if (qs.length > 3) {
        setErrors({ questions: "You can add up to 3 questions." });
        return;
      }
      if (!form.guidelines) {
        setErrors({ guidelines: "Please acknowledge the community guidelines." });
        return;
      }
    }
    setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
  }

  function handlePublish() {
    const ev = createEvent({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category as EventCategory,
      date: form.date,
      time: form.time,
      city: form.city.trim(),
      location: form.location.trim(),
      maxAttendees: Number(form.maxAttendees),
      type: form.type,
      organizerId: user!.id,
      organizerName: user!.name,
      questions: form.questions.map((q) => q.trim()).filter(Boolean),
    });
    toast.success("Event published.");
    navigate({ to: "/community-events/$id", params: { id: ev.id } });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-5 lg:px-8 py-10 max-w-2xl mx-auto w-full">
        <button
          onClick={() => navigate({ to: "/events/community" })}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Step {step} of 4
          </p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full ${
                  n <= step ? "bg-gold" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-soft space-y-5">
          {step === 1 && (
            <>
              <h1 className="font-display text-2xl">Basic information</h1>
              <Field label="Event title" error={errors.title}>
                <Input
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. Sunday Brunch & Slow Talk"
                  maxLength={120}
                />
              </Field>
              <Field label="Description" error={errors.description}>
                <Textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={5}
                  placeholder="What is this event about? What can people expect?"
                  maxLength={2000}
                />
              </Field>
              <Field label="Category" error={errors.category}>
                <Select
                  value={form.category}
                  onValueChange={(v) => update("category", v as EventCategory)}
                >
                  <SelectTrigger><SelectValue placeholder="Choose a category" /></SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-display text-2xl">Logistics</h1>
              <p className="text-xs text-muted-foreground -mt-3">
                In-person only. Online events aren't supported on Pagu.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date" error={errors.date}>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                  />
                </Field>
                <Field label="Time" error={errors.time}>
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(e) => update("time", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="City" error={errors.city}>
                <Input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="Cologne"
                />
              </Field>
              <Field label="Location" error={errors.location}>
                <Input
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="Venue or meeting point"
                />
              </Field>
              <Field label="Maximum attendees" error={errors.maxAttendees}>
                <Input
                  type="number"
                  min={2}
                  max={200}
                  value={form.maxAttendees}
                  onChange={(e) => update("maxAttendees", Number(e.target.value))}
                />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="font-display text-2xl">Participation</h1>
              <Field label="Event type">
                <div className="grid grid-cols-1 gap-2">
                  {(["public", "request", "invite"] as const).map((t) => (
                    <label
                      key={t}
                      className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                        form.type === t
                          ? "border-gold/60 bg-primary/5"
                          : "border-border hover:border-border/80"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={t}
                        checked={form.type === t}
                        onChange={() => update("type", t)}
                        className="mt-1 accent-[color:var(--gold)]"
                      />
                      <div>
                        <p className="text-sm font-medium">{EVENT_TYPE_LABEL[t]}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t === "public" && "Any approved member can join immediately."}
                          {t === "request" && "You review and approve each application."}
                          {t === "invite" && "Visible to members, but requires your invitation."}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </Field>

              <Field
                label="Application questions (1–3)"
                error={errors.questions}
              >
                <div className="space-y-2">
                  {form.questions.map((q, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={q}
                        onChange={(e) => {
                          const next = [...form.questions];
                          next[i] = e.target.value;
                          update("questions", next);
                        }}
                        placeholder={
                          i === 0
                            ? "Why do you want to join?"
                            : "Another question (optional)"
                        }
                        maxLength={200}
                      />
                      {form.questions.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            update(
                              "questions",
                              form.questions.filter((_, j) => j !== i),
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {form.questions.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => update("questions", [...form.questions, ""])}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add question
                    </Button>
                  )}
                </div>
              </Field>

              <label className="flex items-start gap-3 rounded-xl border border-border p-4">
                <Checkbox
                  checked={form.guidelines}
                  onCheckedChange={(v) => update("guidelines", v === true)}
                  className="mt-0.5"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I commit to hosting a safe, FLINTA*-centered space grounded in
                  respect, consent and inclusion.
                </span>
              </label>
              {errors.guidelines && (
                <p className="text-xs text-destructive">{errors.guidelines}</p>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <h1 className="font-display text-2xl">Review & publish</h1>
              <div className="space-y-3 text-sm">
                <Summary label="Title" value={form.title} />
                <Summary label="Category" value={form.category} />
                <Summary
                  label="When"
                  value={`${form.date} · ${form.time}`}
                />
                <Summary label="Where" value={`${form.location}, ${form.city}`} />
                <Summary label="Max attendees" value={String(form.maxAttendees)} />
                <Summary label="Type" value={EVENT_TYPE_LABEL[form.type]} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Questions
                  </p>
                  <ul className="mt-1 list-disc list-inside text-muted-foreground space-y-1">
                    {form.questions.filter(Boolean).map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Description
                  </p>
                  <p className="mt-1 text-foreground/90 whitespace-pre-wrap">
                    {form.description}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="rounded-full text-xs">
                Publishes immediately — no admin approval
              </Badge>
            </>
          )}

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => (step === 1 ? navigate({ to: "/events/community" }) : setStep((s) => (s - 1) as 1 | 2 | 3 | 4))}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step < 4 ? (
              <Button type="button" variant="hero" onClick={next}>
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="button" variant="hero" onClick={handlePublish}>
                Publish event
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-5 py-20">
        <div className="w-full max-w-md text-center bg-card border border-border/60 rounded-2xl p-8 shadow-soft">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
