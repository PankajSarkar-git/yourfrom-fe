import React from "react";
import { Sliders, Sparkles, X, Settings2 } from "lucide-react";
import FieldUISettings from "./FieldUISettings";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import FieldConditionSettings from "./FieldConditionSettings";
import FieldGeneralSettings from "./FieldGeneralSettings";
import FieldOptionSettings from "./FieldOptionSettings";
import FieldValidationSettings from "./FieldValidationSettings";
import FormBasicSettings, { type FormBasicData } from "./FormBasicSettings";
import type { FormFieldConfig } from "../FormBuilder/FormField";

interface FieldEditorProps {
  field: FormFieldConfig | null;
  fields: FormFieldConfig[];
  form: FormBasicData;
  open?: boolean;
  activeTab?: "field" | "form";
  onTabChange?: (tab: "field" | "form") => void;
  onClose: () => void;
  onUpdateField: (fieldId: string, updates: Partial<FormFieldConfig>) => void;
  onUpdateForm: (updates: Partial<FormBasicData>) => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  fields,
  form,
  open = true,
  activeTab = field ? "field" : "form",
  onTabChange,
  onClose,
  onUpdateField,
  onUpdateForm,
}) => {
  const [internalTab, setInternalTab] = React.useState<"field" | "form">(
    field ? "field" : "form"
  );

  React.useEffect(() => {
    if (field) {
      setInternalTab("field");
    } else {
      setInternalTab("form");
    }
  }, [field]);

  const currentTab = onTabChange ? activeTab : internalTab;
  const setTab = (tab: "field" | "form") => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  if (!open) {
    return null;
  }

  const fieldId = field ? (field._id ?? field.name) : null;

  const updateField = (updates: Partial<FormFieldConfig>) => {
    if (fieldId) {
      onUpdateField(fieldId, updates);
    }
  };

  const isOptionField =
    field &&
    ["select", "multiselect", "radio", "checkbox"].includes(field.type);

  const defaultValue =
    field?.defaultValue == null
      ? ""
      : typeof field.defaultValue === "string"
        ? field.defaultValue
        : JSON.stringify(field.defaultValue, null, 2);

  return (
    <aside className="flex h-full w-84 shrink-0 flex-col border-l bg-background shadow-sm">
      {/* Header with Tabs */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        {/* Tab Switcher */}
        <div className="flex items-center rounded-lg border bg-muted/40 p-0.5">
          <button
            type="button"
            disabled={!field}
            onClick={() => setTab("field")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              currentTab === "field" && field
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
          >
            <Settings2 className="h-3.5 w-3.5" />
            Field
          </button>
          <button
            type="button"
            onClick={() => setTab("form")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              currentTab === "form"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Form
          </button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onClose}
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-4">
          {/* TAB: Form Settings */}
          {currentTab === "form" ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold tracking-tight">Form Settings</h3>
                <p className="text-xs text-muted-foreground">
                  Customize form branding, behaviors & presentation
                </p>
              </div>
              <FormBasicSettings form={form} onChange={onUpdateForm} />
            </div>
          ) : field ? (
            /* TAB: Field Settings */
            <div className="space-y-6">
              {/* Field Header Summary */}
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Field Type
                  </span>
                  <p className="font-semibold text-sm capitalize">
                    {field.type.replace(/-/g, " ")}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {field.name}
                </span>
              </div>

              {/* General Settings */}
              <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  General Info
                </h3>
                <FieldGeneralSettings field={field} onChange={updateField} />
              </section>

              <Separator />

              {/* Default Value */}
              <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Default Value
                </h3>
                <Textarea
                  value={defaultValue}
                  placeholder="Enter initial default value..."
                  rows={2}
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
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Validation Rules
                </h3>
                <FieldValidationSettings field={field} onChange={updateField} />
              </section>

              {/* Appearance */}
              <Separator />
              <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Layout & Styling
                </h3>
                <FieldUISettings field={field} onChange={updateField} />
              </section>

              {/* Conditions */}
              <Separator />
              <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Conditional Logic
                </h3>
                <FieldConditionSettings
                  field={field}
                  fields={fields}
                  onChange={updateField}
                />
              </section>
            </div>
          ) : (
            /* Fallback if no field selected */
            <div className="py-12 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Sparkles className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold">No field selected</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Click on any field on the canvas to configure its validation, options, and conditional logic.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTab("form")}
              >
                Open Form Settings
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default FieldEditor;
