import React from "react";
import { Palette, Sliders, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface FormHeaderCardProps {
  title: string;
  description: string;
  coverImage?: string;
  logo?: string;
  status: "draft" | "published" | "archived";
  primaryColor?: string;
  selected: boolean;
  onSelect: () => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onOpenSettings?: () => void;
  onColorChange?: (color: string) => void;
}

export const THEME_COLOR_PRESETS = [
  { name: "Blue", hex: "#2563eb" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Emerald", hex: "#059669" },
  { name: "Rose", hex: "#e11d48" },
  { name: "Amber", hex: "#d97706" },
  { name: "Cyan", hex: "#0891b2" },
  { name: "Pink", hex: "#db2777" },
  { name: "Indigo", hex: "#4f46e5" },
];

export const FormHeaderCard: React.FC<FormHeaderCardProps> = ({
  title,
  description,
  coverImage,
  logo,
  status,
  primaryColor = "#2563eb",
  selected,
  onSelect,
  onTitleChange,
  onDescriptionChange,
  onOpenSettings,
  onColorChange,
}) => {
  const statusConfig = {
    draft: {
      label: "Draft",
      className: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border-amber-300",
    },
    published: {
      label: "Published",
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-300",
    },
    archived: {
      label: "Archived",
      className: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300",
    },
  }[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <div
      onClick={onSelect}
      style={{
        borderColor: selected ? primaryColor : undefined,
      }}
      className={`group relative rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-200 cursor-pointer overflow-hidden ${
        selected
          ? "ring-2 ring-primary/25 shadow-md"
          : "hover:border-primary/50"
      }`}
    >
      {/* Top accent gradient bar customized by primaryColor */}
      <div
        className="h-2.5 w-full transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, ${primaryColor} 0%, #8b5cf6 50%, #ec4899 100%)`,
        }}
      />

      {/* Cover Image Banner if present */}
      {coverImage && (
        <div className="relative h-40 w-full overflow-hidden bg-muted">
          <img
            src={coverImage}
            alt="Form Cover"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>
      )}

      <div className="p-6 sm:p-7 space-y-4">
        {/* Top meta bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {logo && (
              <div className="h-12 w-12 shrink-0 rounded-xl border bg-background p-1.5 shadow-sm overflow-hidden">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <Badge variant="outline" className={`font-semibold ${statusConfig.className}`}>
              {statusConfig.label}
            </Badge>

            {/* Quick Color Swatches directly on Header */}
            {onColorChange && (
              <div
                className="flex items-center gap-1.5 rounded-full border bg-muted/40 px-2 py-1"
                onClick={(e) => e.stopPropagation()}
                title="Change theme color"
              >
                <Palette className="h-3.5 w-3.5 text-muted-foreground mr-0.5" />
                {THEME_COLOR_PRESETS.slice(0, 5).map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => onColorChange(preset.hex)}
                    style={{ backgroundColor: preset.hex }}
                    className={`h-4 w-4 rounded-full transition-transform ${
                      primaryColor === preset.hex
                        ? "scale-125 ring-2 ring-foreground/40 shadow-xs"
                        : "hover:scale-110"
                    }`}
                    title={preset.name}
                  />
                ))}

                {/* Custom Color Input */}
                <label className="relative cursor-pointer ml-0.5">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    style={{ backgroundColor: primaryColor }}
                    className="h-4 w-4 rounded-full border border-foreground/30 shadow-xs flex items-center justify-center text-[9px] font-bold text-white"
                  >
                    +
                  </div>
                </label>
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSettings?.();
            }}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Sliders className="h-3.5 w-3.5" />
            Form Settings
          </Button>
        </div>

        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            placeholder="Untitled Form Title..."
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0"
          />
        </div>

        {/* Description Input */}
        <div>
          <textarea
            value={description}
            placeholder="Give respondents clear instructions or a warm welcome message..."
            rows={2}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full resize-none bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 leading-relaxed"
          />
        </div>

        {/* Helper bottom hint */}
        <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Click header card to edit theme colors, banners & submission rules in right panel
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormHeaderCard;
