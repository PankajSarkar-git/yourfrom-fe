
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

import FormField, {
  type FormFieldConfig,
} from "../FormBuilder/FormField";

interface CheckboxFieldProps {
  field: FormFieldConfig;
  value?: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

const CheckboxField = ({
  field,
  value = [],
  onChange,
  error,
}: CheckboxFieldProps) => {
  const options = field.options ?? [];

  const selectedValues = Array.isArray(value)
    ? value
    : [];

  const toggleOption = (
    optionValue: string,
    checked: boolean
  ) => {
    if (checked) {
      const newValues = [
        ...selectedValues,
        optionValue,
      ];

      if (
        field.validation?.maxSelect &&
        newValues.length >
          field.validation.maxSelect
      ) {
        return;
      }

      onChange(newValues);
      return;
    }

    onChange(
      selectedValues.filter(
        (item) => item !== optionValue
      )
    );
  };

  return (
    <FormField
      field={field}
      error={error}
    >
      <div className="space-y-3">
        {options.map((option: {value:string ; label:string; disabled?: boolean}) => {
          const id = `${field.name}-${option.value}`;

          const checked =
            selectedValues.includes(option.value);

          return (
            <div
              key={option.value}
              className="flex items-center gap-2"
            >
              <Checkbox
                id={id}
                checked={checked}
                disabled={
                  field.disabled ||
                  option.disabled
                }
                onCheckedChange={(checked: boolean) =>
                  toggleOption(
                    option.value,
                    checked === true
                  )
                }
              />

              <Label
                htmlFor={id}
                className={
                  field.disabled ||
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
      </div>
    </FormField>
  );
};

export default CheckboxField;