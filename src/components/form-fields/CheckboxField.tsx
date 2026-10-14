
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

  const toggleOption = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter((item) => item !== optionValue));
    } else {
      if (
        field.validation?.maxSelect &&
        selectedValues.length >= field.validation.maxSelect
      ) {
        return;
      }
      onChange([...selectedValues, optionValue]);
    }
  };

  return (
    <FormField field={field} error={error}>
      <div className="grid gap-2.5 sm:grid-cols-1">
        {options.map((option: { value: string; label: string; disabled?: boolean }, idx: number) => {
          const id = `${field.name}-${option.value}`;
          const checked = selectedValues.includes(option.value);

          return (
            <div
              key={option.value}
              onClick={() => {
                if (field.disabled || option.disabled) return;
                toggleOption(option.value);
              }}
              className={`group relative flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-all cursor-pointer ${
                checked
                  ? "border-primary bg-primary/8 shadow-xs ring-1 ring-primary/25 text-foreground font-semibold"
                  : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/40 text-foreground/90 font-medium"
              } ${field.disabled || option.disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <div className="flex items-center gap-3 min-w-0 pointer-events-none">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold border transition-colors ${
                    checked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 bg-muted/30 text-muted-foreground group-hover:border-primary/40"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm truncate select-none">{option.label}</span>
              </div>

              <Checkbox
                id={id}
                checked={checked}
                disabled={field.disabled || option.disabled}
                className="shrink-0 pointer-events-none"
              />
            </div>
          );
        })}
      </div>
    </FormField>
  );
};

export default CheckboxField;