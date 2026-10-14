import React from "react";
import { FileText, Plus, Type, Mail, List, Star } from "lucide-react";

import { Button } from "../ui/button";
import FormFieldCard from "./FormFieldCard";
import FormHeaderCard from "./FormHeaderCard";
import type { FormFieldConfig } from "./FormField";

interface BuilderCanvasProps {
  form: {
    title: string;
    description: string;
    coverImage?: string;
    logo?: string;
    status: "draft" | "published" | "archived";
    primaryColor?: string;
  };
  fields: FormFieldConfig[];
  selectedFieldId?: string | null;
  isFormHeaderSelected?: boolean;

  onSelectFormHeader: () => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onColorChange?: (color: string) => void;
  onSelectField: (fieldId: string) => void;
  onDeleteField: (fieldId: string) => void;
  onDuplicateField: (fieldId: string) => void;
  onMoveField: (fieldId: string, direction: "up" | "down") => void;
  onAddField: (type?: string) => void;
  onOpenFormSettings?: () => void;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({
  form,
  fields,
  selectedFieldId,
  isFormHeaderSelected = false,
  onSelectFormHeader,
  onTitleChange,
  onDescriptionChange,
  onColorChange,
  onSelectField,
  onDeleteField,
  onDuplicateField,
  onMoveField,
  onAddField,
  onOpenFormSettings,
}) => {
  const sortedFields = [...fields].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const primaryColor = form.primaryColor || "#2563eb";

  return (
    <main
      className="min-w-0 flex-1 overflow-y-auto bg-muted/20"
      onClick={() => onSelectFormHeader()}
    >
      <div className="mx-auto min-h-full max-w-3xl px-4 py-8 sm:px-8 space-y-4">
        {/* Form Header Card on Canvas */}
        <div onClick={(e) => e.stopPropagation()}>
          <FormHeaderCard
            title={form.title}
            description={form.description}
            coverImage={form.coverImage}
            logo={form.logo}
            status={form.status}
            primaryColor={primaryColor}
            selected={isFormHeaderSelected}
            onSelect={onSelectFormHeader}
            onTitleChange={onTitleChange}
            onDescriptionChange={onDescriptionChange}
            onOpenSettings={onOpenFormSettings}
            onColorChange={onColorChange}
          />
        </div>

        {/* Fields Area */}
        {sortedFields.length === 0 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl border border-dashed bg-card/60 p-8 text-center shadow-xs"
          >
            <div
              style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs"
            >
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-base font-bold">Your form has no questions yet</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              Select questions from the left palette or click any quick-start type below.
            </p>

            {/* Quick Starters */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onAddField("text")}
                className="gap-1.5 text-xs hover:border-blue-400"
              >
                <Type className="h-3.5 w-3.5 text-blue-500" />
                Short Text
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onAddField("email")}
                className="gap-1.5 text-xs hover:border-sky-400"
              >
                <Mail className="h-3.5 w-3.5 text-sky-500" />
                Email
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onAddField("select")}
                className="gap-1.5 text-xs hover:border-purple-400"
              >
                <List className="h-3.5 w-3.5 text-purple-500" />
                Dropdown
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onAddField("rating")}
                className="gap-1.5 text-xs hover:border-amber-400"
              >
                <Star className="h-3.5 w-3.5 text-amber-500" />
                Rating
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5" onClick={(e) => e.stopPropagation()}>
            {sortedFields.map((field, index) => {
              const fieldId = field._id ?? field.name;

              return (
                <FormFieldCard
                  key={fieldId}
                  field={field}
                  selected={selectedFieldId === fieldId}
                  canMoveUp={index > 0}
                  canMoveDown={index < sortedFields.length - 1}
                  primaryColor={primaryColor}
                  onSelect={() => onSelectField(fieldId)}
                  onDelete={() => onDeleteField(fieldId)}
                  onDuplicate={() => onDuplicateField(fieldId)}
                  onMoveUp={() => onMoveField(fieldId, "up")}
                  onMoveDown={() => onMoveField(fieldId, "down")}
                />
              );
            })}

            {/* Add Field Button */}
            <button
              type="button"
              onClick={() => onAddField("text")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-background/50 p-4 text-sm font-semibold text-muted-foreground transition-all hover:border-primary hover:bg-background hover:text-foreground hover:shadow-xs"
            >
              <Plus className="h-4 w-4 text-primary" />
              Add another question
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default BuilderCanvas;