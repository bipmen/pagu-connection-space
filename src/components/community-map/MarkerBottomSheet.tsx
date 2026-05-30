import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Calendar, Sparkles, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { spacesById } from "@/lib/discover-mock";
import { formatDistance, type CommunityMarker } from "@/lib/community-map-mock";

export function MarkerBottomSheet({
  marker,
  onClose,
}: {
  marker: CommunityMarker | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={!!marker} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        {marker && <Body marker={marker} onClose={onClose} />}
      </SheetContent>
    </Sheet>
  );
}

function Body({ marker, onClose }: { marker: CommunityMarker; onClose: () => void }) {
  if (marker.kind === "place") {
    const s = marker.data;
    return (
      <>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gold" /> {s.name}
          </SheetTitle>
          <SheetDescription>
            {s.category} · {formatDistance(Math.round((Math.abs(s.mapX - 50) + Math.abs(s.mapY - 50)) * 40))} away
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-2 text-sm">
          <p className="text-muted-foreground">{s.description}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {s.hours}</p>
          <Badge variant="outline" className="border-gold/40 text-gold">🛡️ Pagu Safe Space · Certified {s.certifiedSince}</Badge>
        </div>
        <Button asChild className="mt-5 w-full" variant="hero">
          <Link to="/discover/safe-space/$id" params={{ id: s.id }} onClick={onClose}>
            View Details <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </>
    );
  }

  if (marker.kind === "activity") {
    const e = marker.data;
    const v = e.safeSpaceId ? spacesById(e.safeSpaceId) : undefined;
    return (
      <>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" /> {e.title}
          </SheetTitle>
          <SheetDescription>
            {new Date(e.date).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} · {e.time}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex flex-wrap gap-2">
            {e.official ? (
              <Badge className="bg-gold text-gold-foreground hover:bg-gold">✨ Official Pagu Event</Badge>
            ) : (
              <Badge variant="secondary">👥 Community Event</Badge>
            )}
            <Badge variant="outline">{e.category}</Badge>
            <Badge variant="outline"><Users className="h-3 w-3 mr-1" /> {e.attendees}</Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {v ? `${v.name} · 🛡️ Hosted at a Pagu Safe Space` : e.location}
          </p>
        </div>
        <Button asChild className="mt-5 w-full" variant="hero">
          <Link to="/community-events/$id" params={{ id: e.id }} onClick={onClose}>
            View Details <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </>
    );
  }

  if (marker.kind === "person") {
    const p = marker.data;
    return (
      <>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {p.name}
          </SheetTitle>
          <SheetDescription>
            {formatDistance(p.distanceMeters)} · Member since {new Date(p.memberSince).getFullYear()}
            {p.organizer && " · ✨ Organizer"}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-3 text-sm">
          <p className="text-muted-foreground">{p.bio}</p>
          <div className="flex flex-wrap gap-1">
            {p.intentions.map((i) => (
              <Badge key={i.label} variant="outline">{i.emoji} {i.label}</Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {p.languages.map((l) => <Badge key={l} variant="secondary">{l}</Badge>)}
          </div>
        </div>
        <Button asChild className="mt-5 w-full" variant="hero">
          <Link to="/rhrn/$id" params={{ id: p.userId }} onClick={onClose}>
            View Details <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </>
    );
  }

  // cluster
  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-500" /> {marker.count} people nearby
        </SheetTitle>
        <SheetDescription>Zoom in to see individual members.</SheetDescription>
      </SheetHeader>
      <Button className="mt-5 w-full" variant="hero" asChild>
        <Link to="/rhrn" onClick={onClose}>Open Right Here Right Now</Link>
      </Button>
    </>
  );
}
