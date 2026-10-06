import React from "react";
import { Input } from "../ui/input";
import FormField, {
  type FormFieldConfig,
} from "../FormBuilder/FormField";

interface NumberFieldProps {
  field: FormFieldConfig;
  value?: number | string;
  onChange: (value: number | string) => void;
  error?: string;
}

const NumberField = ({
  field,
  value = "",
  onChange,
  error,
}: NumberFieldProps) => {
  const min = field.validation?.min;
  const max = field.validation?.max;

  return (
    <FormField
      field={field}
      error={error}
    >
      <Input
        id={field.name}
        name={field.name}
        type="number"
        value={value}
        placeholder={field.placeholder}
        disabled={field.disabled}
        readOnly={field.readOnly}
        required={field.required}
        min={min}
        max={max}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = event.target.value;

          if (inputValue === "") {
            onChange("");
            return;
          }

          onChange(Number(inputValue));
        }}
      />
    </FormField>
  );
};

export default NumberField;