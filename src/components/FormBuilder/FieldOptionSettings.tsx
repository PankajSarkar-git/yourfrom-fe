import React from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

import type {
  FormFieldConfig,
  FormFieldOption,
} from "../FormBuilder/FormField";

interface FieldOptionSettingsProps {
  field: FormFieldConfig;
  onChange: (updates: Partial<FormFieldConfig>) => void;
}

const OPTION_FIELD_TYPES = ["select", "multiselect", "radio", "checkbox"];

const FieldOptionSettings = ({ field, onChange }: FieldOptionSettingsProps) => {
  if (!OPTION_FIELD_TYPES.includes(field.type)) {
    return null;
  }

  const options = field.options ?? [];

  const updateOptions = (nextOptions: FormFieldOption[]) => {
    onChange({
      options: nextOptions,
    });
  };

  const addOption = () => {
    const newOption: FormFieldOption = {
      label: `Option ${options.length + 1}`,
      value: `option_${options.length + 1}`,
      disabled: false,
    };

    updateOptions([...options, newOption]);
  };

  const updateOption = (index: number, updates: Partial<FormFieldOption>) => {
    const nextOptions = options.map((option, optionIndex) =>
      optionIndex === index
        ? {
            ...option,
            ...updates,
          }
        : option,
    );

    updateOptions(nextOptions);
  };

  const deleteOption = (index: number) => {
    updateOptions(options.filter((_, optionIndex) => optionIndex !== index));
  };

  const moveOption = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= options.length) {
      return;
    }

    const nextOptions = [...options];

    [nextOptions[index], nextOptions[targetIndex]] = [
      nextOptions[targetIndex],
      nextOptions[index],
    ];

    updateOptions(nextOptions);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Options</h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Add the choices users can select.
          </p>
        </div>

        <Button type="button" size="sm" onClick={addOption}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add
        </Button>
      </div>

      {/* Options */}
      {options.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm font-medium">No options</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Add an option to give users choices.
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={addOption}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Option
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {options.map((option, index) => (
            <div
              key={`${option.value}-${index}`}
              className="rounded-lg border p-3"
            >
              <div className="flex items-center gap-2">
                {/* Drag / Move */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveOption(index, "up")}
                    className="text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Move option up"
                  >
                    ▲
                  </button>

                  <GripVertical className="h-4 w-4 text-muted-foreground" />

                  <button
                    type="button"
                    disabled={index === options.length - 1}
                    onClick={() => moveOption(index, "down")}
                    className="text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Move option down"
                  >
                    ▼
                  </button>
                </div>

                {/* Fields */}
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`option-label-${index}`}
                      className="text-xs"
                    >
                      Label
                    </Label>

                    <Input
                      id={`option-label-${index}`}
                      value={option.label}
                      placeholder="Option label"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        updateOption(index, {
                          label: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`option-value-${index}`}
                      className="text-xs"
                    >
                      Value
                    </Label>

                    <Input
                      id={`option-value-${index}`}
                      value={option.value}
                      placeholder="option_value"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        updateOption(index, {
                          value: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor={`option-disabled-${index}`}
                        className="cursor-pointer text-xs"
                      >
                        Disabled
                      </Label>

                      <p className="text-[11px] text-muted-foreground">
                        Users cannot select this option.
                      </p>
                    </div>

                    <Switch
                      id={`option-disabled-${index}`}
                      checked={option.disabled ?? false}
                      onCheckedChange={(checked: boolean) =>
                        updateOption(index, {
                          disabled: checked,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Delete */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteOption(index)}
                  aria-label={`Delete option ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Multi-select settings */}
      {(field.type === "multiselect" || field.type === "checkbox") && (
        <>
          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Selection Rules</h4>

              <p className="mt-1 text-xs text-muted-foreground">
                Control how many options users can select.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="min-select" className="text-xs">
                  Minimum
                </Label>

                <Input
                  id="min-select"
                  type="number"
                  min={0}
                  value={field.validation?.minSelect ?? ""}
                  placeholder="0"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = event.target.value;

                    onChange({
                      validation: {
                        ...field.validation,
                        minSelect: value === "" ? undefined : Number(value),
                      },
                    });
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="max-select" className="text-xs">
                  Maximum
                </Label>

                <Input
                  id="max-select"
                  type="number"
                  min={0}
                  value={field.validation?.maxSelect ?? ""}
                  placeholder="No limit"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = event.target.value;

                    onChange({
                      validation: {
                        ...field.validation,
                        maxSelect: value === "" ? undefined : Number(value),
                      },
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Select-specific settings */}
      {field.type === "select" || field.type === "multiselect" ? (
        <>
          <Separator />

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium">Select Behavior</h4>
            </div>

            <SettingSwitch
              label="Searchable"
              description="Allow users to search options."
              checked={field.searchable ?? false}
              onChange={(checked) =>
                onChange({
                  // searchable is an optional flag; set to true when checked, otherwise undefined
                  searchable: checked ? true : undefined,
                })
              }
            />

            <SettingSwitch
              label="Clearable"
              description="Allow users to clear their selection."
              checked={field.clearable ?? false}
              onChange={(checked) =>
                onChange({
                  // clearable is an optional flag; set to true when checked, otherwise undefined
                  clearable: checked ? true : undefined,
                })
              }
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

interface SettingSwitchProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SettingSwitch = ({
  label,
  description,
  checked,
  onChange,
}: SettingSwitchProps) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>

      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
};

export default FieldOptionSettings;
