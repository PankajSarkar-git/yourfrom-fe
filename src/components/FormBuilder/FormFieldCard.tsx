import React from "react";
import {
  Copy,
  GripVertical,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "../ui/card";

import {
  Button,
} from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import DynamicField from "./DynamicField";

import type { FormFieldConfig } from "./FormField";

interface FormFieldCardProps {
  field: FormFieldConfig;
  selected?: boolean;

  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const FormFieldCard = ({
  field,
  selected = false,
  onSelect,
  onDelete,
  onDuplicate,
}: FormFieldCardProps) => {
  return (
    <Card
      className={`group relative cursor-pointer transition-all ${
        selected
          ? "border-primary ring-2 ring-primary/10"
          : "hover:border-primary/40"
      }`}
      onClick={onSelect}
    >
      {/* Top toolbar */}
      <div
        className={`absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-md border bg-background px-1 py-1 shadow-sm transition-opacity ${
          selected
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Drag Handle */}
        <button
          type="button"
          className="flex h-7 w-7 cursor-grab items-center justify-center rounded-sm text-muted-foreground hover:bg-muted active:cursor-grabbing"
          aria-label="Drag field"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <DropdownMenuItem
              onClick={onDuplicate}
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="p-5">
        <div
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <DynamicField
            field={field}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FormFieldCard;