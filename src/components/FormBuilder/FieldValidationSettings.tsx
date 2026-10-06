import React from "react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

import type {
  FormFieldConfig,
  FormFieldValidation,
} from "../FormBuilder/FormField";

interface FieldValidationSettingsProps {
  field: FormFieldConfig;

  onChange: (
    updates: Partial<FormFieldConfig>
  ) => void;
}

const FieldValidationSettings = ({
  field,
  onChange,
}: FieldValidationSettingsProps) => {
  const validation: FormFieldValidation =
    field.validation ?? {};

  const updateValidation = (
    updates: Partial<FormFieldValidation>
  ) => {
    onChange({
      validation: {
        ...validation,
        ...updates,
      },
    });
  };

  const updateNumber = (
    key: keyof FormFieldValidation,
    value: string
  ) => {
    updateValidation({
      [key]:
        value === ""
          ? undefined
          : Number(value),
    });
  };

  const isTextField = [
    "text",
    "textarea",
    "email",
    "password",
    "phone",
    "url",
  ].includes(field.type);

  const isNumberField =
    field.type === "number";

  const isRangeField =
    field.type === "range";

  const isRatingField =
    field.type === "rating";

  const isSelectionField = [
    "multiselect",
    "checkbox",
  ].includes(field.type);

  const isFileField = [
    "file",
    "image",
  ].includes(field.type);

  const isDateField = [
    "date",
    "time",
    "datetime-local",
    "month",
    "week",
  ].includes(field.type);

  const hasSettings =
    isTextField ||
    isNumberField ||
    isRangeField ||
    isRatingField ||
    isSelectionField ||
    isFileField ||
    isDateField;

  if (!hasSettings) {
    return (
      <div className="rounded-lg border border-dashed p-4">
        <p className="text-sm text-muted-foreground">
          This field type does not require additional
          validation settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Text Validation */}
      {isTextField && (
        <section className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">
              Text Validation
            </h4>

            <p className="mt-1 text-xs text-muted-foreground">
              Control the allowed text length and format.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              id="min-length"
              label="Min Length"
              value={
                validation.minLength
              }
              min={0}
              onChange={(value) =>
                updateNumber(
                  "minLength",
                  value
                )
              }
            />

            <NumberInput
              id="max-length"
              label="Max Length"
              value={
                validation.maxLength
              }
              min={0}
              onChange={(value) =>
                updateNumber(
                  "maxLength",
                  value
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="regex">
              Regex Pattern
            </Label>

            <Input
              id="regex"
              value={
                validation.regex ?? ""
              }
              placeholder="^[A-Za-z]+$"
              onChange={(event) =>
                updateValidation({
                  regex:
                    event.target.value ||
                    undefined,
                })
              }
            />

            <p className="text-xs text-muted-foreground">
              Optional regular expression for custom validation.
            </p>
          </div>
        </section>
      )}

      {/* Number Validation */}
      {isNumberField && (
        <section className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">
              Number Validation
            </h4>

            <p className="mt-1 text-xs text-muted-foreground">
              Define the allowed numeric range.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              id="number-min"
              label="Minimum"
              value={validation.min}
              onChange={(value) =>
                updateNumber(
                  "min",
                  value
                )
              }
            />

            <NumberInput
              id="number-max"
              label="Maximum"
              value={validation.max}
              onChange={(value) =>
                updateNumber(
                  "max",
                  value
                )
              }
            />
          </div>

          <NumberInput
            id="number-step"
            label="Step"
            value={validation.step}
            min={0}
            step={0.01}
            onChange={(value) =>
              updateNumber(
                "step",
                value
              )
            }
          />
        </section>
      )}

      {/* Range */}
      {isRangeField && (
        <section className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">
              Range Settings
            </h4>

            <p className="mt-1 text-xs text-muted-foreground">
              Configure the slider boundaries.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              id="range-min"
              label="Minimum"
              value={
                validation.min ?? 0
              }
              onChange={(value) =>
                updateNumber(
                  "min",
                  value
                )
              }
            />

            <NumberInput
              id="range-max"
              label="Maximum"
              value={
                validation.max ?? 100
              }
              onChange={(value) =>
                updateNumber(
                  "max",
                  value
                )
              }
            />
          </div>

          <NumberInput
            id="range-step"
            label="Step"
            value={
              validation.step ?? 1
            }
            min={0.01}
            step={0.01}
            onChange={(value) =>
              updateNumber(
                "step",
                value
              )
            }
          />
        </section>
      )}

      {/* Rating */}
      {isRatingField && (
        <section className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">
              Rating Settings
            </h4>

            <p className="mt-1 text-xs text-muted-foreground">
              Configure the rating scale.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              id="rating-min"
              label="Minimum"
              value={
                validation.min ?? 1
              }
              min={0}
              onChange={(value) =>
                updateNumber(
                  "min",
                  value
                )
              }
            />

            <NumberInput
              id="rating-max"
              label="Maximum"
              value={
                validation.max ?? 5
              }
              min={1}
              onChange={(value) =>
                updateNumber(
                  "max",
                  value
                )
              }
            />
          </div>
        </section>
      )}

      {/* Selection */}
      {isSelectionField && (
        <section className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">
              Selection Validation
            </h4>

            <p className="mt-1 text-xs text-muted-foreground">
              Control how many options can be selected.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              id="min-select"
              label="Minimum"
              value={
                validation.minSelect
              }
              min={0}
              onChange={(value) =>
                updateNumber(
                  "minSelect",
                  value
                )
              }
            />

            <NumberInput
              id="max-select"
              label="Maximum"
              value={
                validation.maxSelect
              }
              min={0}
              onChange={(value) =>
                updateNumber(
                  "maxSelect",
                  value
                )
              }
            />
          </div>
        </section>
      )}

      {/* File */}
      {isFileField && (
        <section className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">
              File Validation
            </h4>

            <p className="mt-1 text-xs text-muted-foreground">
              Configure allowed files and upload limits.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-types">
              Allowed File Types
            </Label>

            <Input
              id="file-types"
              value={(
                validation.fileTypes ??
                []
              ).join(", ")}
              placeholder=".pdf, .jpg, .png"
              onChange={(event) => {
                const types =
                  event.target.value
                    .split(",")
                    .map((item) =>
                      item.trim()
                    )
                    .filter(Boolean);

                updateValidation({
                  fileTypes:
                    types.length > 0
                      ? types
                      : undefined,
                });
              }}
            />

            <p className="text-xs text-muted-foreground">
              Separate file types with commas.
            </p>
          </div>

          <Separator />

          <NumberInput
            id="max-file-size"
            label="Maximum File Size (bytes)"
            value={
              validation.maxFileSize
            }
            min={0}
            onChange={(value) =>
              updateNumber(
                "maxFileSize",
                value
              )
            }
          />

          <NumberInput
            id="max-files"
            label="Maximum Files"
            value={
              validation.maxFiles
            }
            min={1}
            onChange={(value) =>
              updateNumber(
                "maxFiles",
                value
              )
            }
          />
        </section>
      )}

      {/* Date / Time */}
      {isDateField && (
        <section className="space-y-3">
          <div>
            <h4 className="text-sm font-medium">
              Date & Time Validation
            </h4>

            <p className="mt-1 text-xs text-muted-foreground">
              Date range validation can be added when
              the field schema supports minimum and maximum dates.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

interface NumberInputProps {
  id: string;
  label: string;
  value?: number;
  min?: number;
  step?: number;
  onChange: (value: string) => void;
}

const NumberInput = ({
  id,
  label,
  value,
  min,
  step = 1,
  onChange,
}: NumberInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
      </Label>

      <Input
        id={id}
        type="number"
        min={min}
        step={step}
        value={
          value === undefined
            ? ""
            : value
        }
        placeholder="0"
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />
    </div>
  );
};

export default FieldValidationSettings;