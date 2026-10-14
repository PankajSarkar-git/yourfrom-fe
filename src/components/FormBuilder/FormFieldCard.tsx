import React from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Settings,
  Trash2,
} from "lucide-react";

import { Button } from "../ui/button";
import DynamicField from "./DynamicField";
import type { FormFieldConfig } from "./FormField";

interface FormFieldCardProps {
  field: FormFieldConfig;
  selected?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  primaryColor?: string;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const FIELD_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  text: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30" },
  textarea: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30" },
  email: { bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", border: "border-sky-500/30" },
  password: { bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", border: "border-slate-500/30" },
  number: { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/30" },
  phone: { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/30" },
  url: { bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400", border: "border-teal-500/30" },

  select: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/30" },
  multiselect: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/30" },
  radio: { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", border: "border-violet-500/30" },
  checkbox: { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", border: "border-violet-500/30" },
  toggle: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-600 dark:text-fuchsia-400", border: "border-fuchsia-500/30" },
  switch: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-600 dark:text-fuchsia-400", border: "border-fuchsia-500/30" },

  date: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
  time: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
  "datetime-local": { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
  month: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
  week: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },

  file: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/30" },
  image: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/30" },
  rating: { bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-500", border: "border-yellow-500/30" },
  range: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/30" },
  color: { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", border: "border-pink-500/30" },
  tags: { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/30" },
};

const FormFieldCard = ({
  field,
  selected = false,
  canMoveUp = false,
  canMoveDown = false,
  primaryColor = "#3B82F6",
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: FormFieldCardProps) => {
  const typeStyle = FIELD_COLOR_MAP[field.type] || {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
  };

  return (
    <div
      onClick={onSelect}
      style={{
        borderColor: selected ? primaryColor : undefined,
      }}
      className={`group relative rounded-xl border bg-card shadow-xs transition-all duration-200 cursor-pointer overflow-hidden ${
        selected
          ? "ring-2 ring-primary/25 shadow-md"
          : "hover:border-primary/50 hover:shadow-sm"
      }`}
    >
      {/* Selected Indicator Left Bar */}
      {selected && (
        <div
          style={{ backgroundColor: primaryColor }}
          className="absolute left-0 top-0 bottom-0 w-1.5 z-10"
        />
      )}

      {/* DEDICATED VISIBLE FIELD ACTIONS HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-4 py-2.5 transition-colors group-hover:bg-muted/40">
        {/* Left: Drag Handle, Order, Type badge, Required Pill */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/70">
            <GripVertical className="h-4 w-4" />
          </div>

          <span className="text-[11px] font-bold text-muted-foreground/70 font-mono">
            #{field.order ?? 1}
          </span>

          {/* Colorful Field Type Pill */}
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
          >
            {field.type.replace(/-/g, " ")}
          </span>

          {/* Field key name */}
          <span className="hidden sm:inline-block text-[11px] font-mono text-muted-foreground/60 max-w-[120px] truncate">
            {field.name}
          </span>

          {/* Required Badge */}
          {field.required && (
            <span className="rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.2 text-[10px] font-semibold text-red-600 dark:text-red-400">
              Required
            </span>
          )}
        </div>

        {/* Right: Actions Toolbar (ALWAYS VISIBLE & PROMINENT) */}
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Move Up */}
          {onMoveUp && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!canMoveUp}
              onClick={onMoveUp}
              className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-30 transition-colors shadow-2xs"
              title="Move question up"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}

          {/* Move Down */}
          {onMoveDown && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!canMoveDown}
              onClick={onMoveDown}
              className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-30 transition-colors shadow-2xs"
              title="Move question down"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}

          <div className="h-4 w-px bg-border/80 mx-1" />

          {/* Duplicate */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDuplicate}
            className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-background hover:text-foreground transition-colors shadow-2xs"
            title="Duplicate question"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>

          {/* Settings */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onSelect}
            className={`h-7 w-7 rounded-lg transition-colors shadow-2xs ${
              selected
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground hover:bg-background hover:text-foreground"
            }`}
            title="Question settings"
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>

          {/* Delete */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-destructive transition-colors shadow-2xs"
            title="Delete question"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Field Content Body */}
      <div className="p-5 pl-6">
        <div onClick={(e) => e.stopPropagation()}>
          <DynamicField field={field} />
        </div>
      </div>
    </div>
  );
};

export default FormFieldCard;