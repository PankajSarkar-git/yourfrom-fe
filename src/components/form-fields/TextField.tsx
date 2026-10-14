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

  const ui = field.ui;

  return (
    <FormField field={field} error={error}>
      <div className="relative flex items-center">
        {ui?.prefix && (
          <span className="absolute left-3.5 text-xs font-semibold text-muted-foreground select-none pointer-events-none">
            {ui.prefix}
          </span>
        )}
        <Input
          id={field.name}
          name={field.name}
          type={getInputType()}
          value={value}
          placeholder={field.placeholder}
          disabled={field.disabled}
          readOnly={field.readOnly}
          required={field.required}
          className={`h-11 rounded-xl text-sm transition-all shadow-2xs border-border/70 bg-background/80 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            ui?.prefix ? "pl-9" : "px-3.5"
          } ${ui?.suffix ? "pr-9" : ""}`}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
          }}
        />
        {ui?.suffix && (
          <span className="absolute right-3.5 text-xs font-semibold text-muted-foreground select-none pointer-events-none">
            {ui.suffix}
          </span>
        )}
      </div>
    </FormField>
  );
};

export default TextField;
