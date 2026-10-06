import React from "react";
import { Input } from "../ui/input";

import FormField, {
  type FormFieldConfig,
} from "../FormBuilder/FormField";

interface DateFieldProps {
  field: FormFieldConfig;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const DateField = ({
  field,
  value = "",
  onChange,
  error,
}: DateFieldProps) => {
  const getInputType = (): "date" | "month" | "week" => {
    switch (field.type) {
      case "month":
        return "month";

      case "week":
        return "week";

      default:
        return "date";
    }
  };

  return (
    <FormField
      field={field}
      error={error}
    >
      <Input
        id={field.name}
        name={field.name}
        type={getInputType()}
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

export default DateField;