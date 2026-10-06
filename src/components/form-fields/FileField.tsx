import React from "react";
import { Upload, X, FileIcon } from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import FormField, {
  type FormFieldConfig,
} from "../FormBuilder/FormField";

interface FileFieldProps {
  field: FormFieldConfig;
  value?: File[];
  onChange: (value: File[]) => void;
  error?: string;
}

const FileField = ({
  field,
  value = [],
  onChange,
  error,
}: FileFieldProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedFiles = Array.isArray(value)
    ? value
    : [];

  const isMultiple =
    field.multiple === true ||
    (field.validation?.maxFiles ?? 1) > 1;

  const maxFiles =
    field.validation?.maxFiles;

  const maxFileSize =
    field.validation?.maxFileSize;

  const fileTypes =
    field.validation?.fileTypes ?? [];

  const accept =
    fileTypes.length > 0
      ? fileTypes.join(",")
      : field.type === "image"
        ? "image/*"
        : undefined;

  const formatFileSize = (
    bytes: number
  ): string => {
    if (bytes === 0) {
      return "0 Bytes";
    }

    const units = [
      "Bytes",
      "KB",
      "MB",
      "GB",
    ];

    const index = Math.floor(
      Math.log(bytes) /
        Math.log(1024)
    );

    return `${(
      bytes /
      Math.pow(1024, index)
    ).toFixed(2)} ${units[index]}`;
  };

  const handleFiles = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      event.target.files ?? []
    );

    if (files.length === 0) {
      return;
    }

    let validFiles = files;

    if (maxFileSize) {
      validFiles = validFiles.filter(
        (file) =>
          file.size <= maxFileSize
      );
    }

    if (maxFiles) {
      validFiles = validFiles.slice(
        0,
        maxFiles
      );
    }

    if (isMultiple) {
      onChange([
        ...selectedFiles,
        ...validFiles,
      ]);
    } else {
      onChange(
        validFiles.length > 0
          ? [validFiles[0]]
          : []
      );
    }

    event.target.value = "";
  };

  const removeFile = (
    index: number
  ) => {
    const updatedFiles =
      selectedFiles.filter(
        (_, fileIndex) =>
          fileIndex !== index
      );

    onChange(updatedFiles);
  };

  const openFilePicker = () => {
    if (
      field.disabled ||
      field.readOnly
    ) {
      return;
    }

    inputRef.current?.click();
  };

  return (
    <FormField
      field={field}
      error={error}
    >
      <div className="space-y-3">
        <div
          role="button"
          tabIndex={
            field.disabled ||
            field.readOnly
              ? -1
              : 0
          }
          onClick={
            openFilePicker
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              event.preventDefault();
              openFilePicker();
            }
          }}
          className={`flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors ${
            field.disabled ||
            field.readOnly
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-muted/50"
          }`}
        >
          <Upload className="mb-2 h-6 w-6 text-muted-foreground" />

          <p className="text-sm font-medium">
            {field.placeholder ||
              "Click to upload"}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {isMultiple
              ? "Multiple files allowed"
              : "One file allowed"}
          </p>

          {maxFileSize && (
            <p className="mt-1 text-xs text-muted-foreground">
              Maximum size:{" "}
              {formatFileSize(
                maxFileSize
              )}
            </p>
          )}

          <Input
            ref={inputRef}
            id={field.name}
            name={field.name}
            type="file"
            accept={accept}
            multiple={isMultiple}
            disabled={
              field.disabled
            }
            className="hidden"
            onChange={
              handleFiles
            }
          />
        </div>

        {selectedFiles.length >
          0 && (
          <div className="space-y-2">
            {selectedFiles.map(
              (file, index) => (
                <div
                  key={`${file.name}-${file.lastModified}-${index}`}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <FileIcon className="h-5 w-5 shrink-0 text-muted-foreground" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {file.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(
                          file.size
                        )}
                      </p>
                    </div>
                  </div>

                  {!field.disabled &&
                    !field.readOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeFile(
                            index
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </FormField>
  );
};

export default FileField;