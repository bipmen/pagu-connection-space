import { useEffect, useState } from "react";
import { Flag, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  REPORT_REASONS,
  hasUserReportedEvent,
  reportEvent,
  type ReportReason,
} from "@/lib/events-mock";

type Props = {
  eventId: string;
  userId: string;
};

export function ReportEventDialog({ eventId, userId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alreadyReported, setAlreadyReported] = useState(false);

  useEffect(() => {
    if (open) setAlreadyReported(hasUserReportedEvent(eventId, userId));
  }, [open, eventId, userId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) {
      toast.error("Please choose a reason.");
      return;
    }
    setSubmitting(true);
    reportEvent({ eventId, userId, reason, note });
    setSubmitting(false);
    toast.success("Thanks. We'll review this report.");
    setOpen(false);
    setReason("");
    setNote("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Flag className="h-3.5 w-3.5" /> Report event
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Report this event</DialogTitle>
          <DialogDescription>
            Help us keep Pagu a safe, FLINTA*-centered space. Your report is
            confidential and reviewed by our team.
          </DialogDescription>
        </DialogHeader>

        {alreadyReported ? (
          <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4">
            <ShieldCheck className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              You've already reported this event. Thanks — we'll review it.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                Reason
              </Label>
              <RadioGroup
                value={reason}
                onValueChange={(v) => setReason(v as ReportReason)}
                className="gap-2"
              >
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-3 py-2.5 text-sm hover:border-gold/40 transition-colors cursor-pointer"
                  >
                    <RadioGroupItem value={r} id={`reason-${r}`} />
                    <span>{r}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="report-note"
                className="text-xs uppercase tracking-widest text-muted-foreground"
              >
                Additional context (optional)
              </Label>
              <Textarea
                id="report-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Anything else our team should know?"
                maxLength={500}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="hero" disabled={submitting}>
                Submit report
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
