import React from "react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

import type {
  FormFieldConfig,
  FormFieldUI,
} from "../FormBuilder/FormField";

interface FieldUISettingsProps {
  field: FormFieldConfig;

  onChange: (
    updates: Partial<FormFieldConfig>
  ) => void;
}

const WIDTH_OPTIONS: {
  label: string;
  value: NonNullable<FormFieldUI["width"]>;
}[] = [
  {
    label: "25%",
    value: "25%",
  },
  {
    label: "33%",
    value: "33%",
  },
  {
    label: "50%",
    value: "50%",
  },
  {
    label: "66%",
    value: "66%",
  },
  {
    label: "75%",
    value: "75%",
  },
  {
    label: "100%",
    value: "100%",
  },
];

const FieldUISettings = ({
  field,
  onChange,
}: FieldUISettingsProps) => {
  const ui: FormFieldUI =
    field.ui ?? {};

  const updateUI = (
    updates: Partial<FormFieldUI>
  ) => {
    onChange({
      ui: {
        ...ui,
        ...updates,
      },
    });
  };

  return (
    <div className="space-y-5">
      {/* Width */}
      <div className="space-y-2">
        <Label htmlFor="field-width">
          Field Width
        </Label>

        <Select
          value={ui.width ?? "100%"}
          onValueChange={(value) =>
            updateUI({
              width:
                value as FormFieldUI["width"],
            })
          }
        >
          <SelectTrigger id="field-width">
            <SelectValue placeholder="Select width" />
          </SelectTrigger>

          <SelectContent>
            {WIDTH_OPTIONS.map(
              (option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <p className="text-xs text-muted-foreground">
          Controls how much horizontal space the field uses.
        </p>
      </div>

      {/* Help Text */}
      <div className="space-y-2">
        <Label htmlFor="field-help-text">
          Help Text
        </Label>

        <Textarea
          id="field-help-text"
          value={ui.helpText ?? ""}
          placeholder="Add helpful information..."
          rows={3}
          onChange={(event) =>
            updateUI({
              helpText:
                event.target.value ||
                undefined,
            })
          }
        />

        <p className="text-xs text-muted-foreground">
          Additional information shown below the field.
        </p>
      </div>

      {/* Prefix */}
      <div className="space-y-2">
        <Label htmlFor="field-prefix">
          Prefix
        </Label>

        <Input
          id="field-prefix"
          value={ui.prefix ?? ""}
          placeholder="$"
          onChange={(event) =>
            updateUI({
              prefix:
                event.target.value ||
                undefined,
            })
          }
        />

        <p className="text-xs text-muted-foreground">
          Content displayed before the input value.
        </p>
      </div>

      {/* Suffix */}
      <div className="space-y-2">
        <Label htmlFor="field-suffix">
          Suffix
        </Label>

        <Input
          id="field-suffix"
          value={ui.suffix ?? ""}
          placeholder="kg"
          onChange={(event) =>
            updateUI({
              suffix:
                event.target.value ||
                undefined,
            })
          }
        />

        <p className="text-xs text-muted-foreground">
          Content displayed after the input value.
        </p>
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <Label htmlFor="field-icon">
          Icon
        </Label>

        <Input
          id="field-icon"
          value={ui.icon ?? ""}
          placeholder="Mail"
          onChange={(event) =>
            updateUI({
              icon:
                event.target.value ||
                undefined,
            })
          }
        />

        <p className="text-xs text-muted-foreground">
          Icon name used by the field renderer.
        </p>
      </div>
    </div>
  );
};

export default FieldUISettings;