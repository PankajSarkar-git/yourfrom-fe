import React from "react";
import { Plus } from "lucide-react";
import { cn } from "../../lib/utils";

export interface FieldTypeConfig {
  type: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  category?: string;
}

interface FieldPaletteItemProps {
  field: FieldTypeConfig;
  onAdd: (fieldType: string) => void;
}

export const CATEGORY_STYLES: Record<
  string,
  {
    border: string;
    bg: string;
    iconBg: string;
    iconColor: string;
    badge: string;
  }
> = {
  Basic: {
    border: "border-blue-200/70 hover:border-blue-500/80 dark:border-blue-900/40",
    bg: "hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/50",
  },
  Choice: {
    border: "border-purple-200/70 hover:border-purple-500/80 dark:border-purple-900/40",
    bg: "hover:bg-purple-50/50 dark:hover:bg-purple-950/20",
    iconBg: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white",
    iconColor: "text-purple-600 dark:text-purple-400",
    badge: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/50",
  },
  "Date & Time": {
    border: "border-emerald-200/70 hover:border-emerald-500/80 dark:border-emerald-900/40",
    bg: "hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/50",
  },
  Advanced: {
    border: "border-amber-200/70 hover:border-amber-500/80 dark:border-amber-900/40",
    bg: "hover:bg-amber-50/50 dark:hover:bg-amber-950/20",
    iconBg: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/50",
  },
};

const FieldPaletteItem = ({ field, onAdd }: FieldPaletteItemProps) => {
  const Icon = field.icon;
  const category = field.category || "Basic";
  const styles = CATEGORY_STYLES[category] || CATEGORY_STYLES.Basic;

  return (
    <button
      type="button"
      onClick={() => onAdd(field.type)}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-xl border p-2.5 text-left",
        "bg-card/90 shadow-2xs transition-all duration-150 active:scale-[0.98]",
        styles.border,
        styles.bg,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      )}
    >
      {/* Icon with smooth category color transition */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-2xs transition-all duration-150",
          styles.iconBg
        )}
      >
        <Icon className="h-4 w-4 transition-colors" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p className="truncate text-xs font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {field.label}
          </p>
        </div>

        {field.description && (
          <p className="truncate text-[11px] text-muted-foreground">
            {field.description}
          </p>
        )}
      </div>

      {/* Plus icon on hover */}
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 scale-75">
        <Plus className="h-3.5 w-3.5" />
      </div>
    </button>
  );
};

export default FieldPaletteItem;