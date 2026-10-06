import React from "react";
import { X } from "lucide-react";
import FieldUISettings from "./FieldUISettings";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import FieldConditionSettings from "./FieldConditionSettings";
import FieldGeneralSettings from "./FieldGeneralSettings";
import FieldOptionSettings from "./FieldOptionSettings";
import FieldValidationSettings from "./FieldValidationSettings";
import type { FormFieldConfig } from "../FormBuilder/FormField";

interface FieldEditorProps {
  field: FormFieldConfig | null;
  fields: FormFieldConfig[];
  open?: boolean;

  onClose: () => void;

  onUpdateField: (fieldId: string, updates: Partial<FormFieldConfig>) => void;
}

const FieldEditor = ({
  field,
  fields,
  open = true,
  onClose,
  onUpdateField,
}: FieldEditorProps) => {
  if (!open) {
    return null;
  }

  if (!field) {
    return (
      <aside className="flex h-full w-80 shrink-0 flex-col border-l bg-background">
        <div className="flex h-full items-center justify-center p-6 text-center">
          <div>
            <h2 className="text-sm font-semibold">No field selected</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Select a field from the canvas to edit its settings.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const fieldId = field._id ?? field.name;

  const updateField = (updates: Partial<FormFieldConfig>) => {
    onUpdateField(fieldId, updates);
  };

  const isOptionField = ["select", "multiselect", "radio", "checkbox"].includes(
    field.type,
  );

  const defaultValue =
    field.defaultValue == null
      ? ""
      : typeof field.defaultValue === "string"
        ? field.defaultValue
        : JSON.stringify(field.defaultValue, null, 2);

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l bg-background">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Field Settings</h2>

          <p className="truncate text-xs text-muted-foreground">
            {field.label || field.name}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onClose}
          aria-label="Close field editor"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-6 p-4">
          {/* General */}
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">General</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Configure the basic field information.
              </p>
            </div>

            <FieldGeneralSettings field={field} onChange={updateField} />
          </section>

          <Separator />

          {/* Field Type */}
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Field Type</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Current field type
              </p>
            </div>

            <div className="rounded-md border bg-muted/30 px-3 py-2">
              <span className="text-sm font-medium capitalize">
                {field.type.replace(/-/g, " ")}
              </span>
            </div>
          </section>

          <Separator />

          {/* Default Value */}
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Default Value</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Set the initial value for this field.
              </p>
            </div>

            <Textarea
              value={defaultValue}
              placeholder="Enter default value..."
              rows={3}
              onChange={(event) => {
                updateField({
                  defaultValue: event.target.value,
                });
              }}
            />
          </section>

          {/* Options */}
          {isOptionField && (
            <>
              <Separator />

              <FieldOptionSettings field={field} onChange={updateField} />
            </>
          )}

          {/* Validation */}
          <Separator />

          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Validation</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Configure validation rules for this field.
              </p>
            </div>

            <FieldValidationSettings field={field} onChange={updateField} />
          </section>

          {/* Appearance */}
          <Separator />

          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Appearance</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Configure the field appearance.
              </p>
            </div>

            <FieldUISettings field={field} onChange={updateField} />
          </section>

          {/* Conditions */}
          <Separator />

          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Conditions</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Show or hide this field based on other fields.
              </p>
            </div>

            <FieldConditionSettings
              field={field}
              fields={fields}
              onChange={updateField}
            />
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default FieldEditor;
