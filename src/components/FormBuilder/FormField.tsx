import React from "react";
import { Label } from "../ui/label";

export interface FormFieldConfig {
  _id?: string;
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  defaultValue?: unknown;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  order?: number;
  options?: {
    label: string;
    value: string;
    disabled?: boolean;
  }[];
  validation?: FormFieldValidation;
  searchable: true;
  multiple?: boolean;
  clearable?: boolean;
  ui?: FormFieldUI;
}

export interface FormFieldOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface FormFieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  regex?: string;
  minSelect?: number;
  maxSelect?: number;
  fileTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  step?: number;
}
export interface FormFieldUI {
  width?: "25%" | "33%" | "50%" | "66%" | "75%" | "100%";

  helpText?: string;

  prefix?: string;

  suffix?: string;

  icon?: string;
}

export type FormFieldConditionOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "greaterThan"
  | "lessThan";

export interface FormFieldCondition {
  fieldId?: string;

  operator?: FormFieldConditionOperator;

  value?: unknown;
}

interface FormFieldProps {
  field: FormFieldConfig;
  children: React.ReactNode;
  error?: string;
  className?: string;
}

const FormField = ({
  field,
  children,
  error,
  className = "",
}: FormFieldProps) => {
  const {
    name,
    label,
    description,
    required = false,
    disabled = false,
    hidden = false,
  } = field;

  if (hidden) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={name} className={disabled ? "opacity-50" : ""}>
          {label}

          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {children}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default FormField;
