import React from "react";
import { Input } from "../ui/input";

import FormField, {
  type FormFieldConfig,
} from "../FormBuilder/FormField";

interface TimeFieldProps {
  field: FormFieldConfig;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const TimeField = ({
  field,
  value = "",
  onChange,
  error,
}: TimeFieldProps) => {
  return (
    <FormField
      field={field}
      error={error}
    >
      <Input
        id={field.name}
        name={field.name}
        type="time"
        value={value}
        disabled={field.disabled}
        readOnly={field.readOnly}
        required={field.required}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.value);
        }}
      />
    </FormField>
  );
};

export default TimeField;