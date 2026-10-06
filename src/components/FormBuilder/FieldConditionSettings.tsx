import React from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import type {
  FormFieldConfig,
  FormFieldCondition,
} from "../FormBuilder/FormField";

interface FieldConditionSettingsProps {
  field: FormFieldConfig & {
    conditions?: FormFieldCondition[];
  };

  fields: FormFieldConfig[];

  onChange: (
    updates: Partial<FormFieldConfig> & {
      conditions?: FormFieldCondition[];
    }
  ) => void;
}

const OPERATORS = [
  {
    value: "equals",
    label: "Equals",
  },
  {
    value: "notEquals",
    label: "Not equals",
  },
  {
    value: "contains",
    label: "Contains",
  },
  {
    value: "greaterThan",
    label: "Greater than",
  },
  {
    value: "lessThan",
    label: "Less than",
  },
] as const;

const FieldConditionSettings = ({
  field,
  fields,
  onChange,
}: FieldConditionSettingsProps) => {
  const conditions =
    field.conditions ?? [];

  /*
   * A field should not be able to depend on itself.
   */
  const availableFields = fields.filter(
    (item) =>
      item._id !== field._id &&
      item.name !== field.name &&
      item.type !== "hidden"
  );

  const updateConditions = (
    nextConditions: FormFieldCondition[]
  ) => {
    onChange({
      conditions:
        nextConditions.length > 0
          ? nextConditions
          : undefined,
    });
  };

  const addCondition = () => {
    if (
      availableFields.length === 0
    ) {
      return;
    }

    const firstField =
      availableFields[0];

    const newCondition: FormFieldCondition =
      {
        fieldId:
          firstField._id ??
          firstField.name,

        operator: "equals",

        value:
          getDefaultConditionValue(
            firstField
          ),
      };

    updateConditions([
      ...conditions,
      newCondition,
    ]);
  };

  const updateCondition = (
    index: number,
    updates: Partial<FormFieldCondition>
  ) => {
    const nextConditions =
      conditions.map(
        (condition, conditionIndex) =>
          conditionIndex === index
            ? {
                ...condition,
                ...updates,
              }
            : condition
      );

    updateConditions(nextConditions);
  };

  const deleteCondition = (
    index: number
  ) => {
    updateConditions(
      conditions.filter(
        (_, conditionIndex) =>
          conditionIndex !== index
      )
    );
  };

  const getConditionField = (
    condition: FormFieldCondition
  ) => {
    return availableFields.find(
      (item) =>
        (item._id ??
          item.name) ===
        condition.fieldId
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold">
          Conditions
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Control when this field should be displayed.
        </p>
      </div>

      {/* No available fields */}
      {availableFields.length === 0 && (
        <div className="rounded-lg border border-dashed p-4">
          <p className="text-sm font-medium">
            No fields available
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Add another field before creating a condition.
          </p>
        </div>
      )}

      {/* Conditions */}
      {conditions.length > 0 && (
        <div className="space-y-4">
          {conditions.map(
            (condition, index) => {
              const conditionField =
                getConditionField(
                  condition
                );

              return (
                <div
                  key={`${condition.fieldId}-${index}`}
                  className="space-y-4 rounded-lg border p-3"
                >
                  {/* Condition number */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Condition {index + 1}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        deleteCondition(
                          index
                        )
                      }
                      aria-label="Delete condition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Field */}
                  <div className="space-y-2">
                    <Label>
                      Field
                    </Label>

                    <Select
                      value={
                        condition.fieldId
                          ? String(condition.fieldId)
                          : ""
                      }
                      onValueChange={(
                        fieldId
                      ) => {
                        const selectedField =
                          availableFields.find(
                            (item) =>
                              (item._id ??
                                item.name) ===
                              fieldId
                          );

                        updateCondition(
                          index,
                          {
                            fieldId: fieldId ?? undefined,
                            value:
                              selectedField
                                ? getDefaultConditionValue(
                                    selectedField
                                  )
                                : "",
                          }
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>

                      <SelectContent>
                        {availableFields.map(
                          (
                            availableField
                          ) => {
                            const value =
                              availableField._id ??
                              availableField.name;

                            return (
                              <SelectItem
                                key={
                                  value
                                }
                                value={
                                  value
                                }
                              >
                                {availableField.label ||
                                  availableField.name}
                              </SelectItem>
                            );
                          }
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Operator */}
                  <div className="space-y-2">
                    <Label>
                      Operator
                    </Label>

                    <Select
                      value={
                        condition.operator ??
                        "equals"
                      }
                      onValueChange={(
                        operator
                      ) =>
                        updateCondition(
                          index,
                          {
                            operator:
                              operator as FormFieldCondition["operator"],
                          }
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>

                      <SelectContent>
                        {OPERATORS.map(
                          (
                            operator
                          ) => (
                            <SelectItem
                              key={
                                operator.value
                              }
                              value={
                                operator.value
                              }
                            >
                              {
                                operator.label
                              }
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Value */}
                  <ConditionValue
                    field={
                      conditionField
                    }
                    value={
                      condition.value
                    }
                    onChange={(
                      value
                    ) =>
                      updateCondition(
                        index,
                        {
                          value,
                        }
                      )
                    }
                  />
                </div>
              );
            }
          )}
        </div>
      )}

      {/* Add */}
      {availableFields.length > 0 && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={
            addCondition
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Condition
        </Button>
      )}

      {conditions.length > 0 && (
        <p className="text-xs text-muted-foreground">
          All conditions must match for this field to be displayed.
        </p>
      )}
    </div>
  );
};

interface ConditionValueProps {
  field?: FormFieldConfig;

  value: unknown;

  onChange: (
    value: unknown
  ) => void;
}

const ConditionValue = ({
  field,
  value,
  onChange,
}: ConditionValueProps) => {
  if (!field) {
    return (
      <div className="space-y-2">
        <Label>
          Value
        </Label>

        <Input
          value={
            value == null
              ? ""
              : String(value)
          }
          disabled
          placeholder="Select a field first"
        />
      </div>
    );
  }

  /*
   * Select / Radio
   */
  if (
    field.type === "select" ||
    field.type === "radio"
  ) {
    return (
      <div className="space-y-2">
        <Label>
          Value
        </Label>

        <Select
          value={
            typeof value ===
            "string"
              ? value
              : ""
          }
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select value" />
          </SelectTrigger>

          <SelectContent>
            {(field.options ??
              []).map(
              (option) => (
                <SelectItem
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                  disabled={
                    option.disabled
                  }
                >
                  {option.label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>
    );
  }

  /*
   * Multi select / Checkbox
   *
   * For now, use a text input.
   * Multiple condition values can later
   * be implemented with a multi-select.
   */
  if (
    field.type ===
      "multiselect" ||
    field.type === "checkbox"
  ) {
    return (
      <div className="space-y-2">
        <Label>
          Value
        </Label>

        <Input
          value={
            Array.isArray(value)
              ? value.join(", ")
              : value == null
                ? ""
                : String(value)
          }
          placeholder="react, typescript"
          onChange={(event) => {
            const values =
              event.target.value
                .split(",")
                .map((item) =>
                  item.trim()
                )
                .filter(Boolean);

            onChange(
              values
            );
          }}
        />

        <p className="text-xs text-muted-foreground">
          Separate multiple values with commas.
        </p>
      </div>
    );
  }

  /*
   * Number / Range / Rating
   */
  if (
    field.type ===
      "number" ||
    field.type === "range" ||
    field.type === "rating"
  ) {
    return (
      <div className="space-y-2">
        <Label>
          Value
        </Label>

        <Input
          type="number"
          value={
            typeof value ===
            "number"
              ? value
              : ""
          }
          onChange={(event) => {
            const nextValue =
              event.target
                .value;

            onChange(
              nextValue === ""
                ? ""
                : Number(
                    nextValue
                  )
            );
          }}
        />
      </div>
    );
  }

  /*
   * Boolean
   */
  if (
    field.type ===
      "toggle" ||
    field.type === "switch"
  ) {
    return (
      <div className="space-y-2">
        <Label>
          Value
        </Label>

        <Select
          value={
            value === true
              ? "true"
              : "false"
          }
          onValueChange={(
            nextValue
          ) =>
            onChange(
              nextValue ===
                "true"
            )
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="true">
              True
            </SelectItem>

            <SelectItem value="false">
              False
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  /*
   * Default text value
   */
  return (
    <div className="space-y-2">
      <Label>
        Value
      </Label>

      <Input
        value={
          value == null
            ? ""
            : String(value)
        }
        placeholder="Enter value"
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />
    </div>
  );
};

const getDefaultConditionValue = (
  field: FormFieldConfig
): unknown => {
  if (
    field.type ===
      "toggle" ||
    field.type === "switch"
  ) {
    return false;
  }

  if (
    field.type ===
      "number" ||
    field.type === "range" ||
    field.type === "rating"
  ) {
    return 0;
  }

  if (
    field.type ===
      "multiselect" ||
    field.type === "checkbox"
  ) {
    return [];
  }

  return (
    field.options?.[0]
      ?.value ?? ""
  );
};

export default FieldConditionSettings;