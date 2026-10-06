import React from "react";
import { X } from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import FormField, {
  type FormFieldConfig,
} from "../FormBuilder/FormField";

interface TagsFieldProps {
  field: FormFieldConfig;
  value?: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

const TagsField = ({
  field,
  value = [],
  onChange,
  error,
}: TagsFieldProps) => {
  const [inputValue, setInputValue] =
    React.useState("");

  const tags = Array.isArray(value)
    ? value
    : [];

  const addTag = () => {
    const newTag = inputValue.trim();

    if (!newTag) {
      return;
    }

    const alreadyExists = tags.some(
      (tag) =>
        tag.toLowerCase() ===
        newTag.toLowerCase()
    );

    if (alreadyExists) {
      setInputValue("");
      return;
    }

    const maxTags =
      field.validation?.maxSelect;

    if (
      maxTags &&
      tags.length >= maxTags
    ) {
      return;
    }

    onChange([
      ...tags,
      newTag,
    ]);

    setInputValue("");
  };

  const removeTag = (
    tagToRemove: string
  ) => {
    if (
      field.disabled ||
      field.readOnly
    ) {
      return;
    }

    onChange(
      tags.filter(
        (tag) => tag !== tagToRemove
      )
    );
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Enter" ||
      event.key === ","
    ) {
      event.preventDefault();
      addTag();
      return;
    }

    if (
      event.key === "Backspace" &&
      !inputValue &&
      tags.length > 0
    ) {
      removeTag(
        tags[tags.length - 1]
      );
    }
  };

  return (
    <FormField
      field={field}
      error={error}
    >
      <div
        className={`min-h-10 rounded-md border border-input bg-background px-3 py-2 ${
          field.disabled
            ? "opacity-50"
            : ""
        }`}
      >
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
            >
              {tag}

              {!field.disabled &&
                !field.readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-sm"
                    onClick={() =>
                      removeTag(tag)
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
            </span>
          ))}

          <Input
            id={field.name}
            name={field.name}
            value={inputValue}
            placeholder={
              tags.length === 0
                ? field.placeholder ||
                  "Add tags..."
                : "Add another tag..."
            }
            disabled={field.disabled}
            readOnly={field.readOnly}
            className="h-7 min-w-[120px] flex-1 border-0 p-0 shadow-none focus-visible:ring-0"
            onChange={(event) =>
              setInputValue(
                event.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            onBlur={addTag}
          />
        </div>
      </div>
    </FormField>
  );
};

export default TagsField;