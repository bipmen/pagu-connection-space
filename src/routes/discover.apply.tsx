import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, Shield } from "lucide-react";
import { submitApplication } from "@/lib/safe-spaces-mock";

export const Route = createFileRoute("/discover/apply")({
  head: () => ({ meta: [{ title: "Become a Pagu Safe Space — Apply" }, { name: "robots", content: "noindex" }] }),
  component: ApplyPage,
});

const STEPS = [
  "Applied",
  "Training Scheduled",
  "Training Completed",
  "Certified Safe Space",
  "Annual Renewal",
];

function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    category: "",
    contactPerson: "",
    email: "",
    website: "",
    motivation: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitApplication(form);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link to="/discover"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>

        {submitted ? (
          <Card className="border-gold/30 bg-gold/5">
            <CardContent className="p-6 space-y-5 text-center">
              <Shield className="h-10 w-10 text-gold mx-auto" />
              <h1 className="font-display text-2xl">Application received</h1>
              <p className="text-sm text-muted-foreground">
                Thank you, {form.contactPerson || "friend"}. We'll be in touch about training within a few days.
              </p>
              <CertificationJourney current={0} />
              <p className="text-xs text-muted-foreground">
                Safe Space certification is renewed every 12 months. Certification may be revoked if community safety standards are violated.
              </p>
              <Button asChild variant="hero"><Link to="/discover">Back to Discover</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div>
              <h1 className="font-display text-3xl">Become a Pagu Safe Space</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Tell us about your venue. We'll follow up to schedule staff training and a community walkthrough.
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <form onSubmit={onSubmit} className="space-y-4">
                  <Field label="Business name" value={form.businessName} onChange={(v) => set("businessName", v)} required />
                  <Field label="Category" value={form.category} onChange={(v) => set("category", v)} placeholder="Café, bar, venue..." required />
                  <Field label="Contact person" value={form.contactPerson} onChange={(v) => set("contactPerson", v)} required />
                  <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} required />
                  <Field label="Website" value={form.website} onChange={(v) => set("website", v)} placeholder="https://" />
                  <div className="space-y-1.5">
                    <Label htmlFor="motivation">Why do you want to become a Pagu Safe Space?</Label>
                    <Textarea id="motivation" rows={5} value={form.motivation} onChange={(e) => set("motivation", e.target.value)} required />
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full">Submit application</Button>
                </form>
              </CardContent>
            </Card>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}{required && <span className="text-destructive"> *</span>}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} />
    </div>
  );
}

function CertificationJourney({ current }: { current: number }) {
  return (
    <ol className="text-left space-y-2 max-w-sm mx-auto">
      {STEPS.map((s, i) => (
        <li key={s} className="flex items-center gap-3">
          <span className={`h-6 w-6 rounded-full border flex items-center justify-center text-xs ${
            i <= current ? "bg-gold text-gold-foreground border-gold" : "border-border text-muted-foreground"
          }`}>
            {i <= current ? <Check className="h-3 w-3" /> : i + 1}
          </span>
          <span className={i <= current ? "text-foreground font-medium" : "text-muted-foreground"}>{s}</span>
        </li>
      ))}
    </ol>
  );
}
