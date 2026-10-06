import React from "react";

import FormField, {
  type FormFieldConfig,
} from "./FormField";

import TextField from "../form-fields/TextField";
import TextareaField from "../form-fields/TextareaField";
import NumberField from "../form-fields/NumberField";
import SelectField from "../form-fields/SelectField";
import MultiSelectField from "../form-fields/MultiSelectField";
import RadioField from "../form-fields/RadioField";
import CheckboxField from "../form-fields/CheckboxField";
import DateField from "../form-fields/DateField";
import TimeField from "../form-fields/TimeField";
import DateTimeField from "../form-fields/DateTimeField";
import FileField from "../form-fields/FileField";
import RatingField from "../form-fields/RatingField";
import RangeField from "../form-fields/RangeField";
import ColorField from "../form-fields/ColorField";
import ToggleField from "../form-fields/ToggleField";
import TagsField from "../form-fields/TagsField";

interface DynamicFieldProps {
  field: FormFieldConfig;

  value?: unknown;

  onChange?: (value: unknown) => void;

  error?: string;
}

const DynamicField = ({
  field,
  value,
  onChange,
  error,
}: DynamicFieldProps) => {
  const handleChange = (nextValue: unknown) => {
    onChange?.(nextValue);
  };

  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "phone":
    case "url":
      return (
        <TextField
          field={field}
          value={
            typeof value === "string"
              ? value
              : ""
          }
          onChange={handleChange as (value: string) => void}
          error={error}
        />
      );

    case "textarea":
      return (
        <TextareaField
          field={field}
          value={
            typeof value === "string"
              ? value
              : ""
          }
          onChange={handleChange as (value: string) => void}
          error={error}
        />
      );

    case "number":
      return (
        <NumberField
          field={field}
          value={
            typeof value === "number" ||
            typeof value === "string"
              ? value
              : ""
          }
          onChange={
            handleChange as (
              value: number | string
            ) => void
          }
          error={error}
        />
      );

    case "select":
      return (
        <SelectField
          field={field}
          value={
            typeof value === "string"
              ? value
              : ""
          }
          onChange={handleChange as (value: string) => void}
          error={error}
        />
      );

    case "multiselect":
      return (
        <MultiSelectField
          field={field}
          value={
            Array.isArray(value)
              ? value.filter(
                  (item): item is string =>
                    typeof item === "string"
                )
              : []
          }
          onChange={
            handleChange as (
              value: string[]
            ) => void
          }
          error={error}
        />
      );

    case "radio":
      return (
        <RadioField
          field={field}
          value={
            typeof value === "string"
              ? value
              : ""
          }
          onChange={handleChange as (value: string) => void}
          error={error}
        />
      );

    case "checkbox":
      return (
        <CheckboxField
          field={field}
          value={
            Array.isArray(value)
              ? value.filter(
                  (item): item is string =>
                    typeof item === "string"
                )
              : []
          }
          onChange={
            handleChange as (
              value: string[]
            ) => void
          }
          error={error}
        />
      );

    case "date":
    case "month":
    case "week":
      return (
        <DateField
          field={field}
          value={
            typeof value === "string"
              ? value
              : ""
          }
          onChange={handleChange as (value: string) => void}
          error={error}
        />
      );

    case "time":
      return (
        <TimeField
          field={field}
          value={
            typeof value === "string"
              ? value
              : ""
          }
          onChange={handleChange as (value: string) => void}
          error={error}
        />
      );

    case "datetime-local":
      return (
        <DateTimeField
          field={field}
          value={
            typeof value === "string"
              ? value
              : ""
          }
          onChange={handleChange as (value: string) => void}
          error={error}
        />
      );

    case "file":
    case "image":
      return (
        <FileField
          field={field}
          value={
            Array.isArray(value)
              ? value.filter(
                  (item): item is File =>
                    item instanceof File
                )
              : []
          }
          onChange={
            handleChange as (
              value: File[]
            ) => void
          }
          error={error}
        />
      );

    case "rating":
      return (
        <RatingField
          field={field}
          value={
            typeof value === "number"
              ? value
              : 0
          }
          onChange={
            handleChange as (
              value: number
            ) => void
          }
          error={error}
        />
      );

    case "range":
      return (
        <RangeField
          field={field}
          value={
            typeof value === "number"
              ? value
              : 0
          }
          onChange={
            handleChange as (
              value: number
            ) => void
          }
          error={error}
        />
      );

    case "color":
      return (
        <ColorField
          field={field}
          value={
            typeof value === "string"
              ? value
              : "#000000"
          }
          onChange={handleChange as (value: string) => void}
          error={error}
        />
      );

    case "toggle":
    case "switch":
      return (
        <ToggleField
          field={field}
          value={
            typeof value === "boolean"
              ? value
              : false
          }
          onChange={
            handleChange as (
              value: boolean
            ) => void
          }
          error={error}
        />
      );

    case "tags":
      return (
        <TagsField
          field={field}
          value={
            Array.isArray(value)
              ? value.filter(
                  (item): item is string =>
                    typeof item === "string"
                )
              : []
          }
          onChange={
            handleChange as (
              value: string[]
            ) => void
          }
          error={error}
        />
      );

    case "hidden":
      return null;

    default:
      return (
        <FormField
          field={field}
          error={error}
        >
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            Unsupported field type:{" "}
            <span className="font-medium">
              {field.type}
            </span>
          </div>
        </FormField>
      );
  }
};

export default DynamicField;