
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import FormField, { type FormFieldConfig } from "../FormBuilder/FormField";

interface SelectFieldProps {
  field: FormFieldConfig;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const SelectField = ({
  field,
  value = "",
  onChange,
  error,
}: SelectFieldProps) => {
  const options = field.options ?? [];

  return (
    <FormField field={field} error={error}>
      <Select
        value={value}
        onValueChange={(value) => onChange(value ?? "")}
        disabled={field.disabled}
        required={field.required}
      >
        <SelectTrigger id={field.name} className="w-full">
          <SelectValue placeholder={field.placeholder || "Select an option"} />
        </SelectTrigger>

        <SelectContent>
          {options.map(
            (option: { label: string; value: string; disabled?: boolean}) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>
    </FormField>
  );
};

export default SelectField;
