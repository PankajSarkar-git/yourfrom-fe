import React from "react";
import { Input } from "../ui/input";

import FormField, {
  type FormFieldConfig,
} from "../FormBuilder/FormField";

interface ColorFieldProps {
  field: FormFieldConfig;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const ColorField = ({
  field,
  value = "#000000",
  onChange,
  error,
}: ColorFieldProps) => {
  const colorValue =
    /^#[0-9A-Fa-f]{6}$/.test(value)
      ? value
      : "#000000";

  return (
    <FormField
      field={field}
      error={error}
    >
      <div className="flex items-center gap-3">
        <Input
          id={field.name}
          name={field.name}
          type="color"
          value={colorValue}
          disabled={field.disabled}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
          }}
          className="h-10 w-14 cursor-pointer p-1"
        />

        <Input
          type="text"
          value={value}
          placeholder="#000000"
          disabled={field.disabled}
          readOnly={field.readOnly}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
          }}
          className="font-mono"
        />
      </div>
    </FormField>
  );
};

export default ColorField;