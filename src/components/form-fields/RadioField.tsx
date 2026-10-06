
import {
  RadioGroup,
  RadioGroupItem,
} from "../ui/radio-group";
import { Label } from "../ui/label";

import FormField, {
  type FormFieldConfig,
} from "../FormBuilder/FormField";

interface RadioFieldProps {
  field: FormFieldConfig;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const RadioField = ({
  field,
  value = "",
  onChange,
  error,
}: RadioFieldProps) => {
  const options = field.options ?? [];

  return (
    <FormField
      field={field}
      error={error}
    >
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={field.disabled}
        className="space-y-2"
      >
        {options.map((option) => {
          const id = `${field.name}-${option.value}`;

          return (
            <div
              key={option.value}
              className="flex items-center gap-2"
            >
              <RadioGroupItem
                id={id}
                value={option.value}
                disabled={option.disabled}
              />

              <Label
                htmlFor={id}
                className={
                  option.disabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }
              >
                {option.label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </FormField>
  );
};

export default RadioField;