import React from "react";
import { Input } from "../ui/input";

import FormField, {
  type FormFieldConfig,
} from "../FormBuilder/FormField";

interface DateTimeFieldProps {
  field: FormFieldConfig;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const DateTimeField = ({
  field,
  value = "",
  onChange,
  error,
}: DateTimeFieldProps) => {
  return (
    <FormField
      field={field}
      error={error}
    >
      <Input
        id={field.name}
        name={field.name}
        type="datetime-local"
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

export default DateTimeField;