import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, MessageCircle, Shield, Flag } from "lucide-react";
import { useCurrentUser } from "@/lib/session-mock";
import {
  INTENTIONS,
  blockUser,
  getSessionByUserId,
  reportUser,
  sendRequest,
  type ReportReason,
} from "@/lib/rhrn-mock";
import { GoInvisibleFab } from "@/components/rhrn/invisible-button";
import { toast } from "sonner";

export const Route = createFileRoute("/rhrn/$id")({
  head: () => ({ meta: [{ title: "Member — Pagu" }, { name: "robots", content: "noindex" }] }),
  component: ProfilePreview,
});

const ICEBREAKERS = [
  "Want to grab a coffee?",
  "Want company at an event?",
  "Interested in chatting?",
  "Want to go for a walk?",
];

function ProfilePreview() {
  const { id } = Route.useParams();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const session = getSessionByUserId(id);

  if (!user) {
    return <Wrapper><p className="text-center text-muted-foreground">Sign in to view members.</p></Wrapper>;
  }
  if (!session) {
    return <Wrapper><p className="text-center text-muted-foreground">This member is no longer available.</p></Wrapper>;
  }

  return (
    <Wrapper>
      <button onClick={() => navigate({ to: "/rhrn" })} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{session.name}</h1>
              <p className="text-sm text-muted-foreground">{formatDistance(session.distanceFromMe)} · {session.city}</p>
            </div>
            {session.organizer && <Badge className="bg-gold text-gold-foreground">✨ Organizer</Badge>}
          </div>

          {session.bio && <p className="text-sm">{session.bio}</p>}

          <Field label="Currently looking for">
            <div className="flex flex-wrap gap-1.5">
              {session.intentions.map((id) => {
                const i = INTENTIONS.find((x) => x.id === id)!;
                return <Badge key={id} variant="secondary" className="font-normal">{i.emoji} {i.label}</Badge>;
              })}
            </div>
          </Field>

          {session.interests.length > 0 && (
            <Field label="Interests">
              <div className="flex flex-wrap gap-1.5">
                {session.interests.map((x) => <Badge key={x} variant="outline" className="font-normal">{x}</Badge>)}
              </div>
            </Field>
          )}

          {session.languages.length > 0 && (
            <Field label="Languages">
              <p className="text-sm text-muted-foreground">{session.languages.join(", ")}</p>
            </Field>
          )}

          <Field label="Community member since">
            <p className="text-sm text-muted-foreground">
              {new Date(session.memberSince).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
            </p>
          </Field>

          <div className="pt-2 flex flex-wrap gap-2">
            <ConnectDialog targetId={session.userId} targetName={session.name} />
            <BlockDialog targetId={session.userId} targetName={session.name} />
            <ReportDialog targetId={session.userId} targetName={session.name} />
          </div>
        </CardContent>
      </Card>
      <GoInvisibleFab />
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-2xl px-5 py-8">{children}</main>
      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function ConnectDialog({ targetId, targetName }: { targetId: string; targetName: string }) {
  const user = useCurrentUser()!;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState(ICEBREAKERS[0]);
  const [custom, setCustom] = useState("");

  function submit() {
    const text = custom.trim() || pick;
    if (!text) return;
    sendRequest({
      fromUserId: user.id,
      fromName: user.name,
      toUserId: targetId,
      icebreaker: text,
    });
    setOpen(false);
    toast.success("Request sent", { description: `${targetName} will see it shortly.` });
    navigate({ to: "/rhrn" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero"><MessageCircle className="h-4 w-4" /> Connect</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send an icebreaker to {targetName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            {ICEBREAKERS.map((t) => (
              <label key={t} className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 cursor-pointer">
                <input
                  type="radio"
                  name="icebreaker"
                  checked={pick === t && !custom.trim()}
                  onChange={() => { setPick(t); setCustom(""); }}
                />
                <span className="text-sm">{t}</span>
              </label>
            ))}
          </div>
          <Textarea
            placeholder="Or write your own (optional)"
            value={custom}
            maxLength={240}
            onChange={(e) => setCustom(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="hero" onClick={submit}>Send request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BlockDialog({ targetId, targetName }: { targetId: string; targetName: string }) {
  const user = useCurrentUser()!;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Shield className="h-4 w-4" /> Block</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block {targetName}?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          You won't see each other in discovery, can't send requests, and can't chat.
        </p>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => {
              blockUser(user.id, targetId);
              setOpen(false);
              toast.success("User blocked");
              navigate({ to: "/rhrn" });
            }}
          >
            Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReportDialog({ targetId, targetName }: { targetId: string; targetName: string }) {
  const user = useCurrentUser()!;
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("harassment");
  const [note, setNote] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost"><Flag className="h-4 w-4" /> Report</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report {targetName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Select value={reason} onValueChange={(v) => setReason(v as ReportReason)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="harassment">Harassment</SelectItem>
              <SelectItem value="discrimination">Discrimination</SelectItem>
              <SelectItem value="fake_profile">Fake Profile</SelectItem>
              <SelectItem value="inappropriate">Inappropriate Behavior</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Add a note for the admin team (optional)"
            value={note}
            maxLength={500}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => {
              reportUser({ fromUserId: user.id, targetUserId: targetId, reason, note });
              setOpen(false);
              toast.success("Report sent", { description: "Our team will review it." });
            }}
          >
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)}m away`;
  return `${(m / 1000).toFixed(1)}km away`;
}
