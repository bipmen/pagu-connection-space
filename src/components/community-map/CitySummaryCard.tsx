import { Calendar, Shield, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CitySummary } from "@/lib/community-map-mock";

export function CitySummaryCard({ city, summary }: { city: string; summary: CitySummary }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4 sm:p-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">City</p>
        <h2 className="font-display text-2xl text-foreground">{city}</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat icon={<Calendar className="h-4 w-4 text-primary" />} label="Events" value={summary.events} />
          <Stat icon={<Shield className="h-4 w-4 text-gold" />} label="Safe Spaces" value={summary.spaces} />
          <Stat icon={<Sparkles className="h-4 w-4 text-emerald-500" />} label="Available Now" value={summary.people} />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/40 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon}{label}</div>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
