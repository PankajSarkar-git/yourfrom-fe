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
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  ui?: FormFieldUI;
  conditions?: FormFieldCondition[];
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

import { AlertCircle } from "lucide-react";

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
    ui,
  } = field;

  if (hidden) {
    return null;
  }

  const helpText = ui?.helpText || description;

  return (
    <div className={`space-y-1.5 transition-all ${className}`}>
      {label && (
        <div className="flex items-baseline justify-between gap-2">
          <Label
            htmlFor={name}
            className={`text-sm font-semibold text-foreground tracking-tight flex items-center gap-1 ${
              disabled ? "opacity-50" : ""
            }`}
          >
            <span>{label}</span>
            {required && (
              <span
                className="text-red-500 font-bold text-xs"
                title="Required question"
              >
                *
              </span>
            )}
          </Label>
        </div>
      )}

      {helpText && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {helpText}
        </p>
      )}

      <div className="relative mt-1">
        {children}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-150">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FormField;
