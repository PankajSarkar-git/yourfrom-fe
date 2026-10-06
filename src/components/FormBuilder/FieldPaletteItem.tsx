import React from "react";
import { GripVertical } from "lucide-react";

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

const FieldPaletteItem = ({
  field,
  onAdd,
}: FieldPaletteItemProps) => {
  const Icon = field.icon;

  return (
    <button
      type="button"
      onClick={() => onAdd(field.type)}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg border",
        "bg-background p-3 text-left",
        "transition-colors",
        "hover:bg-muted/50",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring"
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {field.label}
        </p>

        {field.description && (
          <p className="truncate text-xs text-muted-foreground">
            {field.description}
          </p>
        )}
      </div>

      <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
};

export default FieldPaletteItem;