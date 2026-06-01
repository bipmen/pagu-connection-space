import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { submitToSheet } from "@/lib/sheets";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email."),
  message: z.string().trim().min(1, "Please write a message.").max(2000),
});

type Status = "idle" | "submitting" | "success" | "error";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, message });
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? "Please check your input.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMsg(null);
    try {
      await submitToSheet({
        sheet: "Contact Messages",
        values: [parsed.data.name, parsed.data.email, parsed.data.message],
      });
      setStatus("success");
    } catch {
      setErrorMsg("Something went wrong. Please try again later.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="px-5 lg:px-8 max-w-7xl mx-auto py-20 md:py-28">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Build together</p>
          <h2 className="font-display text-4xl md:text-5xl text-balance leading-tight mb-6">
            Our inbox is <em className="text-gold not-italic">always open.</em>
          </h2>
          <p className="text-muted-foreground leading-relaxed text-balance">
            Pagu is a community project, and we love hearing from the people around it.
            Whether you want to collaborate, share an idea, propose an event, or simply say hello —
            our inbox is always open.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 shadow-soft space-y-5"
          noValidate
        >
          {status === "success" ? (
            <div className="text-center py-8">
              <div className="h-14 w-14 rounded-full bg-gold/20 mx-auto flex items-center justify-center mb-4">
                <Send className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-display text-2xl mb-2">Message received</h3>
              <p className="text-sm text-muted-foreground">
                Thanks for reaching out. We'll get back to you soon.
              </p>
            </div>
          ) : (
            <>
              <Field label="Name" placeholder="Your name" value={name} onChange={setName} />
              <Field label="Email" placeholder="you@example.com" type="email" value={email} onChange={setEmail} />
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  className="mt-2 w-full bg-input/50 border border-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Send us a message and we'll get back to you soon.
                </p>
              </div>
              {status === "error" && errorMsg && (
                <p className="text-sm text-destructive">{errorMsg}</p>
              )}
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </span>
                ) : (
                  "Join the movement"
                )}
              </Button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full bg-input/50 border border-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60"
      />
    </div>
  );
}
