
import { Switch } from "../ui/switch";

import FormField, {
  type FormFieldConfig,
} from "../FormBuilder/FormField";

interface ToggleFieldProps {
  field: FormFieldConfig;
  value?: boolean;
  onChange: (value: boolean) => void;
  error?: string;
}

const ToggleField = ({
  field,
  value = false,
  onChange,
  error,
}: ToggleFieldProps) => {
  return (
    <FormField
      field={field}
      error={error}
    >
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {field.placeholder ||
              field.label}
          </p>

          {field.description && (
            <p className="text-sm text-muted-foreground">
              {field.description}
            </p>
          )}
        </div>

        <Switch
          id={field.name}
          checked={Boolean(value)}
          disabled={
            field.disabled ||
            field.readOnly
          }
          onCheckedChange={onChange}
        />
      </div>
    </FormField>
  );
};

export default ToggleField;