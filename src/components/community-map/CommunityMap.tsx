import { useRef, useState } from "react";
import { Shield, Calendar, Sparkles, Plus, Minus, Locate } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CommunityMarker } from "@/lib/community-map-mock";

type Props = {
  markers: CommunityMarker[];
  selectedId?: string;
  onSelect: (m: CommunityMarker) => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  cityLabel: string;
};

export function CommunityMap({ markers, selectedId, onSelect, zoom, onZoomChange, cityLabel }: Props) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragging = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragging.current = { startX: e.clientX, startY: e.clientY, baseX: pan.x, baseY: pan.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - dragging.current.startX;
    const dy = e.clientY - dragging.current.startY;
    setPan({ x: dragging.current.baseX + dx, y: dragging.current.baseY + dy });
  }
  function onPointerUp() {
    dragging.current = null;
  }

  return (
    <div className="relative w-full h-[440px] md:h-[560px] rounded-2xl overflow-hidden border border-border/60 shadow-soft bg-card">
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="absolute inset-0 origin-center transition-transform duration-150"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          {/* Stylized mock map background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 30%, oklch(0.36 0.21 295 / 0.20), transparent 60%)," +
                "radial-gradient(ellipse at 70% 70%, oklch(0.88 0.11 90 / 0.14), transparent 60%)," +
                "linear-gradient(180deg, oklch(0.22 0.02 270), oklch(0.16 0.015 270))",
            }}
          />
          <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden>
            <defs>
              <pattern id="cmg" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(0.6 0.02 270 / 0.25)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cmg)" />
            <path
              d="M 0 320 C 200 280, 350 380, 600 340 S 900 360, 1200 320"
              stroke="oklch(0.55 0.12 240 / 0.6)"
              strokeWidth="22"
              fill="none"
              strokeLinecap="round"
            />
            <line x1="0" y1="180" x2="100%" y2="220" stroke="oklch(0.7 0.02 270 / 0.4)" strokeWidth="1.5" />
            <line x1="50%" y1="0" x2="48%" y2="100%" stroke="oklch(0.7 0.02 270 / 0.4)" strokeWidth="1.5" />
          </svg>

          {markers.map((m) => (
            <button
              key={m.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(m);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-full group focus:outline-none",
                selectedId === m.id && "z-20",
              )}
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              aria-label={markerLabel(m)}
            >
              <MarkerVisual marker={m} selected={selectedId === m.id} />
              <div className="mx-auto h-2 w-2 -mt-0.5 rotate-45 bg-inherit" />
            </button>
          ))}
        </div>
      </div>

      {/* City label */}
      <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-muted-foreground/80 bg-background/70 backdrop-blur px-2 py-1 rounded-full">
        {cityLabel}
      </div>

      {/* Zoom + recenter controls */}
      <div className="absolute right-3 top-3 flex flex-col gap-1">
        <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full" onClick={() => onZoomChange(Math.min(2, zoom + 0.2))} aria-label="Zoom in">
          <Plus className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full" onClick={() => onZoomChange(Math.max(0.8, zoom - 0.2))} aria-label="Zoom out">
          <Minus className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full" onClick={() => { setPan({ x: 0, y: 0 }); onZoomChange(1); }} aria-label="Recenter">
          <Locate className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-[10px]">
        <Chip color="bg-gold" icon={<Shield className="h-3 w-3" />} label="Place" />
        <Chip color="bg-primary" icon={<Calendar className="h-3 w-3" />} label="Activity" />
        <Chip color="bg-emerald-500" icon={<Sparkles className="h-3 w-3" />} label="Person" />
      </div>
    </div>
  );
}

function markerLabel(m: CommunityMarker) {
  if (m.kind === "place") return m.data.name;
  if (m.kind === "activity") return m.data.title;
  if (m.kind === "person") return m.data.name;
  const noun = m.itemKind === "person" ? "people" : m.itemKind === "activity" ? "events" : "places";
  return `${m.count} ${noun} nearby`;
}

function MarkerVisual({ marker, selected }: { marker: CommunityMarker; selected: boolean }) {
  if (marker.kind === "cluster") {
    const tone =
      marker.itemKind === "person"
        ? "bg-emerald-500/90 border-emerald-300"
        : marker.itemKind === "activity"
          ? "bg-primary/90 border-primary/60"
          : "bg-gold/90 border-gold/60";
    const emoji = marker.itemKind === "person" ? "🌈" : marker.itemKind === "activity" ? "📅" : "🛡️";
    const noun = marker.itemKind === "person" ? "nearby" : marker.itemKind === "activity" ? "events" : "places";
    return (
      <div
        className={cn(
          "flex items-center justify-center h-10 min-w-10 px-2 rounded-full shadow-lg border-2 text-white font-medium text-xs",
          tone,
          selected && "scale-110 ring-4 ring-background",
        )}
      >
        {emoji} {marker.count} {noun}
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center h-9 w-9 rounded-full shadow-lg border-2 transition-transform group-hover:scale-110",
        marker.kind === "place" && "bg-gold text-gold-foreground border-gold/70",
        marker.kind === "activity" && "bg-primary text-primary-foreground border-primary/70",
        marker.kind === "person" && "bg-emerald-500 text-white border-emerald-400",
        selected && "scale-110 ring-4 ring-background",
      )}
    >
      {marker.kind === "place" && <Shield className="h-4 w-4" />}
      {marker.kind === "activity" && <Calendar className="h-4 w-4" />}
      {marker.kind === "person" && <Sparkles className="h-4 w-4" />}
    </div>
  );
}

function Chip({ color, icon, label }: { color: string; icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-background/70 backdrop-blur border border-border/60 px-2 py-1 rounded-full">
      <span className={cn("h-4 w-4 rounded-full flex items-center justify-center text-white", color)}>{icon}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
