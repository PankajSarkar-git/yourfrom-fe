
import { Slider } from "../ui/slider";

import FormField, {
  type FormFieldConfig,
} from "../FormBuilder/FormField";

interface RangeFieldProps {
  field: FormFieldConfig;
  value?: number;
  onChange: (value: number) => void;
  error?: string;
}

const RangeField = ({
  field,
  value = 0,
  onChange,
  error,
}: RangeFieldProps) => {
  const min = field.validation?.min ?? 0;
  const max = field.validation?.max ?? 100;

  const safeValue = Math.min(
    Math.max(value, min),
    max
  );

  return (
    <FormField
      field={field}
      error={error}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {min}
          </span>

          <span className="rounded-md bg-secondary px-2 py-1 text-sm font-medium">
            {safeValue}
          </span>

          <span className="text-sm text-muted-foreground">
            {max}
          </span>
        </div>

        <Slider
          value={[safeValue]}
          min={min}
          max={max}
          step={1}
          disabled={
            field.disabled ||
            field.readOnly
          }
          onValueChange={(values) => {
            const nextValue = Array.isArray(values)
              ? values[0]
              : values;

            if (nextValue !== undefined) {
              onChange(nextValue);
            }
          }}
          className="w-full"
        />
      </div>
    </FormField>
  );
};

export default RangeField;