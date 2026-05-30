import { Users, Calendar, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityFilter } from "@/lib/community-map-mock";

const OPTIONS: { key: CommunityFilter; label: string; icon: React.ReactNode; hint: string }[] = [
  { key: "community", label: "Community", icon: <Users className="h-3.5 w-3.5" />, hint: "Everything" },
  { key: "activities", label: "Activities", icon: <Calendar className="h-3.5 w-3.5" />, hint: "Events" },
  { key: "places", label: "Places", icon: <Shield className="h-3.5 w-3.5" />, hint: "Safe Spaces" },
  { key: "people", label: "People", icon: <Sparkles className="h-3.5 w-3.5" />, hint: "Available Now" },
];

export function CategoryFilters({
  value,
  onChange,
  disabledKeys = [],
}: {
  value: CommunityFilter;
  onChange: (v: CommunityFilter) => void;
  disabledKeys?: CommunityFilter[];
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="tablist" aria-label="Community filters">
      {OPTIONS.map((o) => {
        const active = value === o.key;
        const disabled = disabledKeys.includes(o.key);
        return (
          <button
            key={o.key}
            role="tab"
            aria-selected={active}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={() => !disabled && onChange(o.key)}
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm border transition-colors",
              active
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border hover:text-foreground",
              disabled && "opacity-40 cursor-not-allowed hover:text-muted-foreground",
            )}
            title={disabled ? "Become Available Now to see people" : o.hint}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
