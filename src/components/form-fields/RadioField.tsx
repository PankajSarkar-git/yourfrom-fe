
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
    <FormField field={field} error={error}>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={field.disabled}
        className="grid gap-2.5 sm:grid-cols-1"
      >
        {options.map((option, idx) => {
          const id = `${field.name}-${option.value}`;
          const isSelected = value === option.value;

          return (
            <div
              key={option.value}
              onClick={() => {
                if (field.disabled || option.disabled) return;
                onChange(option.value);
              }}
              className={`group relative flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/8 shadow-xs ring-1 ring-primary/25 text-foreground font-semibold"
                  : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/40 text-foreground/90 font-medium"
              } ${option.disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <div className="flex items-center gap-3 min-w-0 pointer-events-none">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold border transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 bg-muted/30 text-muted-foreground group-hover:border-primary/40"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm truncate select-none">{option.label}</span>
              </div>

              <RadioGroupItem
                id={id}
                value={option.value}
                disabled={option.disabled}
                className="shrink-0 pointer-events-none"
              />
            </div>
          );
        })}
      </RadioGroup>
    </FormField>
  );
};

export default RadioField;