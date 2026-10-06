import React from "react";
import { Input } from "../ui/input";
import FormField, { type FormFieldConfig } from "../FormBuilder/FormField";


interface TextFieldProps {
  field: FormFieldConfig;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const TextField = ({ field, value = "", onChange, error }: TextFieldProps) => {
  const getInputType = (): React.HTMLInputTypeAttribute => {
    switch (field.type) {
      case "email":
        return "email";

      case "password":
        return "password";

      case "url":
        return "url";

      case "phone":
        return "tel";

      default:
        return "text";
    }
  };

  return (
    <FormField field={field} error={error}>
      <Input
        id={field.name}
        name={field.name}
        type={getInputType()}
        value={value}
        placeholder={field.placeholder}
        disabled={field.disabled}
        readOnly={field.readOnly}
        required={field.required}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.value);
        }}
      />
    </FormField>
  );
};

export default TextField;
