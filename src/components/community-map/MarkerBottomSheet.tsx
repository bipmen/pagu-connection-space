import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Calendar, Sparkles, MapPin, Clock, Users, ArrowRight, ChevronLeft } from "lucide-react";
import { spacesById } from "@/lib/discover-mock";
import { formatDistance, type CommunityMarker, type SingleMarker, type ClusterMarker } from "@/lib/community-map-mock";
import { useEffect, useState } from "react";

export function MarkerBottomSheet({
  marker,
  onClose,
}: {
  marker: CommunityMarker | null;
  onClose: () => void;
}) {
  const [drillDown, setDrillDown] = useState<SingleMarker | null>(null);

  // Reset drill-down whenever the parent marker changes / closes
  useEffect(() => {
    setDrillDown(null);
  }, [marker]);

  const active: CommunityMarker | null = drillDown ?? marker;

  return (
    <Sheet open={!!marker} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        {active && (
          <Body
            marker={active}
            onClose={onClose}
            onDrill={setDrillDown}
            onBack={drillDown ? () => setDrillDown(null) : undefined}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function Body({
  marker,
  onClose,
  onDrill,
  onBack,
}: {
  marker: CommunityMarker;
  onClose: () => void;
  onDrill: (m: SingleMarker) => void;
  onBack?: () => void;
}) {
  const BackBar = onBack ? (
    <button
      type="button"
      onClick={onBack}
      className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
    >
      <ChevronLeft className="h-3.5 w-3.5" /> Back to list
    </button>
  ) : null;

  if (marker.kind === "place") {
    const s = marker.data;
    return (
      <>
        {BackBar}
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
        {BackBar}
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
          <Link to="/community-events/$id" params={{ id: "ev_seed_1" }} onClick={onClose}>
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
        {BackBar}
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
  return <ClusterList marker={marker} onSelect={onDrill} />;
}

function ClusterList({ marker, onSelect }: { marker: ClusterMarker; onSelect: (m: SingleMarker) => void }) {
  const { itemKind, count, items } = marker;
  const title =
    itemKind === "person"
      ? `${count} people nearby`
      : itemKind === "activity"
        ? `${count} events nearby`
        : `${count} Safe Spaces nearby`;
  const Icon = itemKind === "person" ? Sparkles : itemKind === "activity" ? Calendar : Shield;
  const tone =
    itemKind === "person" ? "text-emerald-500" : itemKind === "activity" ? "text-primary" : "text-gold";

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${tone}`} /> {title}
        </SheetTitle>
        <SheetDescription>Tap any item to see details.</SheetDescription>
      </SheetHeader>
      <div className="mt-4 space-y-2">
        {items.map((m) => (
          <ClusterRow key={m.id} item={m} onSelect={() => onSelect(m)} />
        ))}
      </div>
    </>
  );
}

function ClusterRow({ item, onSelect }: { item: SingleMarker; onSelect: () => void }) {
  if (item.kind === "person") {
    const p = item.data;
    return (
      <button
        type="button"
        onClick={onSelect}
        className="w-full text-left rounded-xl border border-border/60 bg-card p-3 flex items-center gap-3 hover:bg-accent/40 transition-colors"
      >
        <div className="h-10 w-10 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-medium shrink-0">
          {p.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground truncate">{p.name}</span>
            {p.organizer && <Badge variant="outline" className="border-gold/40 text-gold text-[10px]">Organizer</Badge>}
          </div>
          <p className="text-xs text-muted-foreground truncate">{formatDistance(p.distanceMeters)} · {p.bio}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </button>
    );
  }
  if (item.kind === "activity") {
    const e = item.data;
    return (
      <button
        type="button"
        onClick={onSelect}
        className="w-full text-left rounded-xl border border-border/60 bg-card p-3 flex items-center gap-3 hover:bg-accent/40 transition-colors"
      >
        <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <Calendar className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-medium text-foreground truncate block">{e.title}</span>
          <p className="text-xs text-muted-foreground truncate">
            {new Date(e.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · {e.time} · {e.location}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </button>
    );
  }
  const s = item.data;
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left rounded-xl border border-border/60 bg-card p-3 flex items-center gap-3 hover:bg-accent/40 transition-colors"
    >
      <div className="h-10 w-10 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
        <Shield className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-medium text-foreground truncate block">{s.name}</span>
        <p className="text-xs text-muted-foreground truncate">{s.category} · ⭐ {s.rating} · {s.hours}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </button>
  );
}
