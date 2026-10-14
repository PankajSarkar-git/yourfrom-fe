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
        className="h-11 rounded-xl text-sm px-3.5 border-border/70 bg-background/80 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs transition-all"
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