import React from "react";
import { Textarea } from "../ui/textarea";
import FormField, { type FormFieldConfig } from "../FormBuilder/FormField";

interface TextareaFieldProps {
  field: FormFieldConfig;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const TextareaField = ({
  field,
  value = "",
  onChange,
  error,
}: TextareaFieldProps) => {
  return (
    <FormField
      field={field}
      error={error}
    >
      <Textarea
        id={field.name}
        name={field.name}
        value={value}
        placeholder={field.placeholder}
        disabled={field.disabled}
        readOnly={field.readOnly}
        required={field.required}
        className="min-h-[100px] rounded-xl text-sm p-3.5 border-border/70 bg-background/80 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs leading-relaxed transition-all resize-y"
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          onChange(event.target.value);
        }}
      />
    </FormField>
  );
};

export default TextareaField;