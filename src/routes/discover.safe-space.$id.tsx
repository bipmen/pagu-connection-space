import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Shield, Clock, MapPin, Star, AlertTriangle, Check, ShieldCheck } from "lucide-react";
import { getSafeSpace, listReviewsFor, submitReport, REPORT_REASON_LABEL, type ReportReason, useSafeSpacesStore } from "@/lib/safe-spaces-mock";
import { CERTIFICATION_STAGES, CERTIFICATION_VALID_MONTHS, REVOCATION_REASONS } from "@/lib/community-map-mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/discover/safe-space/$id")({
  loader: ({ params }) => {
    const space = getSafeSpace(params.id);
    if (!space) throw notFound();
    return { space };
  },
  component: SafeSpaceProfile,
});

function SafeSpaceProfile() {
  useSafeSpacesStore();
  const { id } = Route.useParams();
  const space = getSafeSpace(id)!;
  const reviews = listReviewsFor(space.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link to="/discover"><ArrowLeft className="h-4 w-4" /> Back to Discover</Link>
        </Button>

        {/* Header card */}
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-primary/40 via-gold/20 to-background" />
          <CardContent className="p-6 space-y-3">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1 className="font-display text-3xl text-foreground">{space.name}</h1>
                <p className="text-sm text-muted-foreground">{space.category}</p>
              </div>
              <Badge variant="outline" className="border-gold/40 text-gold">
                <Shield className="h-3.5 w-3.5 mr-1" /> Pagu Safe Space
              </Badge>
            </div>
            <p className="text-sm text-foreground/90">{space.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {space.hours}</div>
              <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {space.address}</div>
              <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-gold" /> Certified since {space.certifiedSince}</div>
              <div className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-gold" /> {space.rating} ({space.reviewsCount} reviews)</div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <section className="space-y-3">
          <h2 className="font-display text-xl">Community reviews</h2>
          <div className="space-y-2">
            {reviews.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{r.authorName}</p>
                    <p className="text-gold text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">"{r.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <ReportDialog spaceId={space.id} />
        </section>

        {/* B2B card */}
        <Card className="border-gold/30 bg-gold/5">
          <CardContent className="p-6 space-y-3">
            <h2 className="font-display text-xl">Want your venue to become a Pagu Safe Space?</h2>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex gap-2"><Check className="h-4 w-4 text-gold" /> Staff training</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-gold" /> Community visibility</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-gold" /> Trusted badge</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-gold" /> Event promotion opportunities</li>
            </ul>
            <Button asChild variant="hero" className="rounded-full">
              <Link to="/discover/apply">Apply Now</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

function ReportDialog({ spaceId }: { spaceId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("staff");
  const [note, setNote] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <AlertTriangle className="h-4 w-4" /> Report a concern
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report a concern</DialogTitle>
          <DialogDescription>Your report stays confidential and is reviewed by the Pagu team.</DialogDescription>
        </DialogHeader>
        <RadioGroup value={reason} onValueChange={(v) => setReason(v as ReportReason)} className="space-y-2">
          {(Object.keys(REPORT_REASON_LABEL) as ReportReason[]).map((k) => (
            <Label key={k} className="flex items-center gap-2 cursor-pointer text-sm font-normal">
              <RadioGroupItem value={k} /> {REPORT_REASON_LABEL[k]}
            </Label>
          ))}
        </RadioGroup>
        <Textarea placeholder="Add any detail you want to share..." value={note} onChange={(e) => setNote(e.target.value)} />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="hero"
            onClick={() => {
              submitReport({ spaceId, reason, note });
              toast.success("Report submitted. Thank you.");
              setOpen(false);
              setNote("");
            }}
          >
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
