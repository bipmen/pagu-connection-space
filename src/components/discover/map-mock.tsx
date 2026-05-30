import { Shield, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type MapMarker = {
  id: string;
  kind: "space" | "event" | "person";
  label: string;
  x: number; // 0..100
  y: number;
};

export function DiscoverMap({
  markers,
  onSelect,
  selectedId,
}: {
  markers: MapMarker[];
  onSelect: (m: MapMarker) => void;
  selectedId?: string;
}) {
  return (
    <div className="relative w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden border border-border/60 shadow-soft bg-card">
      {/* Stylized mock map background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 30%, oklch(0.36 0.21 295 / 0.18), transparent 60%)," +
            "radial-gradient(ellipse at 70% 70%, oklch(0.88 0.11 90 / 0.12), transparent 60%)," +
            "linear-gradient(180deg, oklch(0.22 0.02 270), oklch(0.16 0.015 270))",
        }}
      />
      {/* grid streets */}
      <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden>
        <defs>
          <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(0.6 0.02 270 / 0.25)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
        {/* fake river */}
        <path
          d="M 0 320 C 200 280, 350 380, 600 340 S 900 360, 1200 320"
          stroke="oklch(0.55 0.12 240 / 0.6)"
          strokeWidth="22"
          fill="none"
          strokeLinecap="round"
        />
        {/* fake main avenues */}
        <line x1="0" y1="180" x2="100%" y2="220" stroke="oklch(0.7 0.02 270 / 0.4)" strokeWidth="1.5" />
        <line x1="50%" y1="0" x2="48%" y2="100%" stroke="oklch(0.7 0.02 270 / 0.4)" strokeWidth="1.5" />
      </svg>

      {/* "Cologne" label */}
      <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-muted-foreground/70 bg-background/60 backdrop-blur px-2 py-1 rounded-full">
        Cologne
      </div>

      {markers.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m)}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-full group focus:outline-none",
            selectedId === m.id && "z-20",
          )}
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
          aria-label={m.label}
        >
          <div
            className={cn(
              "flex items-center justify-center h-9 w-9 rounded-full shadow-lg border-2 transition-transform group-hover:scale-110",
              m.kind === "space" && "bg-gold text-gold-foreground border-gold/70",
              m.kind === "event" && "bg-primary text-primary-foreground border-primary/70",
              m.kind === "person" && "bg-emerald-500 text-white border-emerald-400",
              selectedId === m.id && "scale-110 ring-4 ring-background",
            )}
          >
            {m.kind === "space" && <Shield className="h-4 w-4" />}
            {m.kind === "event" && <Calendar className="h-4 w-4" />}
            {m.kind === "person" && <Sparkles className="h-4 w-4" />}
          </div>
          <div className="mx-auto h-2 w-2 -mt-0.5 rotate-45 bg-inherit" />
        </button>
      ))}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex gap-2 text-[10px]">
        <Chip color="bg-gold" icon={<Shield className="h-3 w-3" />} label="Safe Space" />
        <Chip color="bg-primary" icon={<Calendar className="h-3 w-3" />} label="Event" />
        <Chip color="bg-emerald-500" icon={<Sparkles className="h-3 w-3" />} label="Available Now" />
      </div>
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
