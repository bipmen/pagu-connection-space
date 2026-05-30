import { Switch } from "@/components/ui/switch";
import { Sparkles } from "lucide-react";

export function AvailableNowToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
      <span className="flex items-center gap-2 text-sm">
        <Sparkles className="h-4 w-4 text-emerald-500" />
        <span className="font-medium text-foreground">Available Now</span>
        <span className="text-muted-foreground hidden sm:inline">Show only people open to connect right now</span>
      </span>
      <Switch checked={value} onCheckedChange={onChange} aria-label="Available Now toggle" />
    </label>
  );
}
