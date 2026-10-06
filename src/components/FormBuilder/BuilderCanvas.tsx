
import { FileText, Plus } from "lucide-react";

import { Button } from "../ui/button";

import FormFieldCard from "./FormFieldCard";
import type { FormFieldConfig } from "./FormField";

interface BuilderCanvasProps {
  fields: FormFieldConfig[];
  selectedFieldId?: string | null;

  onSelectField: (
    fieldId: string
  ) => void;

  onDeleteField: (
    fieldId: string
  ) => void;

  onDuplicateField: (
    fieldId: string
  ) => void;

  onAddField: () => void;
}

const BuilderCanvas = ({
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  onDuplicateField,
  onAddField,
}: BuilderCanvasProps) => {
  const sortedFields = [...fields].sort(
    (a, b) =>
      (a.order ?? 0) -
      (b.order ?? 0)
  );

  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-muted/30">
      <div className="mx-auto min-h-full max-w-3xl px-6 py-8">
        {sortedFields.length === 0 ? (
          <EmptyCanvas
            onAddField={onAddField}
          />
        ) : (
          <div className="space-y-3">
            {sortedFields.map(
              (field) => {
                const fieldId =
                  field._id ??
                  field.name;

                return (
                  <FormFieldCard
                    key={fieldId}
                    field={field}
                    selected={
                      selectedFieldId ===
                      fieldId
                    }
                    onSelect={() =>
                      onSelectField(
                        fieldId
                      )
                    }
                    onDelete={() =>
                      onDeleteField(
                        fieldId
                      )
                    }
                    onDuplicate={() =>
                      onDuplicateField(
                        fieldId
                      )
                    }
                  />
                );
              }
            )}

            <button
              type="button"
              onClick={onAddField}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              Add another field
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

interface EmptyCanvasProps {
  onAddField: () => void;
}

const EmptyCanvas = ({
  onAddField,
}: EmptyCanvasProps) => {
  return (
    <div className="flex min-h-[600px] items-center justify-center">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>

        <h2 className="text-lg font-semibold">
          Your form is empty
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Add a field from the left panel
          to start building your form.
        </p>

        <Button
          type="button"
          className="mt-5"
          onClick={onAddField}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </div>
    </div>
  );
};

export default BuilderCanvas;