import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

import type { FormFieldConfig } from "../FormBuilder/FormField";

interface FieldGeneralSettingsProps {
  field: FormFieldConfig;
  onChange: (
    updates: Partial<FormFieldConfig>
  ) => void;
}

const FieldGeneralSettings = ({
  field,
  onChange,
}: FieldGeneralSettingsProps) => {
  return (
    <div className="space-y-5">
      {/* Label */}
      <div className="space-y-2">
        <Label htmlFor="field-label">
          Label
        </Label>

        <Input
          id="field-label"
          value={field.label}
          placeholder="Enter field label"
          onChange={(event) =>
            onChange({
              label: event.target.value,
            })
          }
        />
      </div>

      {/* Field Name */}
      <div className="space-y-2">
        <Label htmlFor="field-name">
          Field Name
        </Label>

        <Input
          id="field-name"
          value={field.name}
          placeholder="fieldName"
          onChange={(event) =>
            onChange({
              name: event.target.value,
            })
          }
        />

        <p className="text-xs text-muted-foreground">
          Used as the key when storing the response.
        </p>
      </div>

      {/* Placeholder */}
      <div className="space-y-2">
        <Label htmlFor="field-placeholder">
          Placeholder
        </Label>

        <Input
          id="field-placeholder"
          value={field.placeholder ?? ""}
          placeholder="Enter placeholder..."
          onChange={(event) =>
            onChange({
              placeholder:
                event.target.value,
            })
          }
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="field-description">
          Description
        </Label>

        <Textarea
          id="field-description"
          value={field.description ?? ""}
          placeholder="Add a description..."
          rows={3}
          onChange={(event) =>
            onChange({
              description:
                event.target.value,
            })
          }
        />
      </div>

      {/* Required */}
      <SettingSwitch
        id="field-required"
        label="Required"
        description="User must provide a value."
        checked={field.required ?? false}
        onCheckedChange={(checked) =>
          onChange({
            required: checked,
          })
        }
      />

      {/* Disabled */}
      <SettingSwitch
        id="field-disabled"
        label="Disabled"
        description="Prevent users from changing this field."
        checked={field.disabled ?? false}
        onCheckedChange={(checked) =>
          onChange({
            disabled: checked,
          })
        }
      />

      {/* Read Only */}
      <SettingSwitch
        id="field-readonly"
        label="Read only"
        description="Users can see the value but cannot edit it."
        checked={field.readOnly ?? false}
        onCheckedChange={(checked) =>
          onChange({
            readOnly: checked,
          })
        }
      />

      {/* Hidden */}
      <SettingSwitch
        id="field-hidden"
        label="Hidden"
        description="Hide this field from the form."
        checked={field.hidden ?? false}
        onCheckedChange={(checked) =>
          onChange({
            hidden: checked,
          })
        }
      />
    </div>
  );
};

interface SettingSwitchProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (
    checked: boolean
  ) => void;
}

const SettingSwitch = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: SettingSwitchProps) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
      <div className="min-w-0">
        <Label
          htmlFor={id}
          className="cursor-pointer text-sm font-medium"
        >
          {label}
        </Label>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};

export default FieldGeneralSettings;