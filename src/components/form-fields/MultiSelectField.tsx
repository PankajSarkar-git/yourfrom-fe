import React from "react";
import {
  Check,
  ChevronsUpDown,
  X,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

import { Button } from "../ui/button";

import FormField, {
  type FormFieldConfig,
} from "../FormBuilder/FormField";

interface MultiSelectFieldProps {
  field: FormFieldConfig;
  value?: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

const MultiSelectField = ({
  field,
  value = [],
  onChange,
  error,
}: MultiSelectFieldProps) => {
  const [open, setOpen] = React.useState(false);

  const options = field.options ?? [];

  const selectedValues = Array.isArray(value)
    ? value
    : [];

  const toggleOption = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      onChange(
        selectedValues.filter(
          (item) => item !== optionValue
        )
      );

      return;
    }

    const newValues = [
      ...selectedValues,
      optionValue,
    ];

    if (
      field.validation?.maxSelect &&
      newValues.length >
        field.validation.maxSelect
    ) {
      return;
    }

    onChange(newValues);
  };

  const removeOption = (optionValue: string) => {
    onChange(
      selectedValues.filter(
        (item) => item !== optionValue
      )
    );
  };

  const selectedLabels = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  return (
    <FormField
      field={field}
      error={error}
    >
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={field.disabled}
            className="min-h-10 w-full justify-between"
          >
            <div className="flex min-w-0 flex-1 flex-wrap gap-1">
              {selectedLabels.length > 0 ? (
                selectedLabels.map((option) => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs"
                  >
                    {option.label}

                    {!field.disabled &&
                      !field.readOnly && (
                        <button
                          type="button"
                          className="rounded-sm outline-none hover:text-destructive"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeOption(
                              option.value
                            );
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground">
                  {field.placeholder ||
                    "Select options"}
                </span>
              )}
            </div>

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] p-0"
        >
          <Command>
            {field.searchable && (
              <CommandInput
                placeholder="Search options..."
              />
            )}

            <CommandList>
              <CommandEmpty>
                No options found.
              </CommandEmpty>

              <CommandGroup>
                {options.map((option) => {
                  const isSelected =
                    selectedValues.includes(
                      option.value
                    );

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      disabled={option.disabled}
                      onSelect={() =>
                        toggleOption(
                          option.value
                        )
                      }
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          isSelected
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />

                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormField>
  );
};

export default MultiSelectField;