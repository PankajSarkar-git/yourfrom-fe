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
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          onChange(event.target.value);
        }}
      />
    </FormField>
  );
};

export default TextareaField;