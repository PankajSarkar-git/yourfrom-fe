import React from "react";
import {
  Copy,
  GripVertical,
  MoreHorizontal,
  Settings,
  Trash2,
} from "lucide-react";

import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface FieldActionsProps {
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}

const FieldActions = ({
  onEdit,
  onDuplicate,
  onDelete,
  dragHandleProps,
}: FieldActionsProps) => {
  return (
    <div
      className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-sm"
      onClick={(event) =>
        event.stopPropagation()
      }
    >
      {/* Drag Handle */}
      <button
        type="button"
        aria-label="Drag field"
        className="flex h-7 w-7 cursor-grab items-center justify-center rounded-sm text-muted-foreground hover:bg-muted active:cursor-grabbing"
        {...dragHandleProps}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Edit */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onEdit}
        aria-label="Edit field"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* More actions */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            aria-label="More actions"
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
            onClick={onEdit}
          >
            <Settings className="mr-2 h-4 w-4" />
            Edit field
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onDuplicate}
          >
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FieldActions;