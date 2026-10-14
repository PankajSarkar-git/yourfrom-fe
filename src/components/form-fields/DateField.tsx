import React from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import Calendar, { parseISODate } from "../ui/calendar";
import FormField, { type FormFieldConfig } from "../FormBuilder/FormField";

interface DateFieldProps {
  field: FormFieldConfig;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DateField: React.FC<DateFieldProps> = ({
  field,
  value = "",
  onChange,
  error,
}) => {
  const [open, setOpen] = React.useState(false);

  // Format value for display
  const displayValue = React.useMemo(() => {
    if (!value) return "";

    if (field.type === "month") {
      const parts = value.split("-");
      if (parts.length >= 2) {
        const y = parts[0];
        const m = parseInt(parts[1], 10) - 1;
        if (m >= 0 && m < 12) {
          return `${MONTH_NAMES[m]} ${y}`;
        }
      }
      return value;
    }

    if (field.type === "week") {
      return value.includes("-W") ? `Week ${value.split("-W")[1]}, ${value.split("-W")[0]}` : value;
    }

    const d = parseISODate(value);
    if (!d) return value;

    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [value, field.type]);

  const handleSelectDate = (_date: Date | null, dateStr: string) => {
    onChange(dateStr);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  // Month Picker View
  if (field.type === "month") {
    const curParts = value.split("-");
    const selectedYear = parseInt(curParts[0] || String(new Date().getFullYear()), 10);
    const selectedMonth = curParts[1] ? parseInt(curParts[1], 10) - 1 : -1;

    return (
      <FormField field={field} error={error}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>
            <div
              className={`flex h-10 w-full items-center justify-between rounded-lg border bg-background px-3 py-2 text-xs cursor-pointer shadow-2xs transition-colors hover:border-primary/50 ${
                field.disabled ? "opacity-50 cursor-not-allowed" : ""
              } ${error ? "border-destructive ring-1 ring-destructive/20" : "border-input"}`}
            >
              <div className="flex items-center gap-2 truncate">
                <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className={displayValue ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {displayValue || field.placeholder || "Select month & year..."}
                </span>
              </div>
              {value && !field.disabled && !field.readOnly && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-64 p-3 space-y-3" align="start">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold text-foreground">Select Month</span>
              <select
                value={selectedYear}
                onChange={(e) => {
                  const y = e.target.value;
                  const m = selectedMonth >= 0 ? String(selectedMonth + 1).padStart(2, "0") : "01";
                  onChange(`${y}-${m}`);
                }}
                className="h-7 rounded border bg-background px-2 text-xs font-semibold"
              >
                {Array.from({ length: 40 }).map((_, i) => {
                  const y = new Date().getFullYear() - 20 + i;
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {MONTH_NAMES.map((name, idx) => {
                const isSelected = selectedMonth === idx;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      const mStr = String(idx + 1).padStart(2, "0");
                      onChange(`${selectedYear}-${mStr}`);
                      setOpen(false);
                    }}
                    className={`rounded-lg py-1.5 text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {name.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </FormField>
    );
  }

  return (
    <FormField field={field} error={error}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <div
            className={`flex h-10 w-full items-center justify-between rounded-lg border bg-background px-3 py-2 text-xs cursor-pointer shadow-2xs transition-all hover:border-primary/50 ${
              field.disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${error ? "border-destructive ring-1 ring-destructive/20" : "border-input"}`}
          >
            <div className="flex items-center gap-2 truncate">
              <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
              <span className={displayValue ? "text-foreground font-medium" : "text-muted-foreground"}>
                {displayValue || field.placeholder || "Select date..."}
              </span>
            </div>

            {value && !field.disabled && !field.readOnly && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                title="Clear date"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 border shadow-xl rounded-2xl overflow-hidden" align="start">
          <Calendar
            selected={value}
            onSelect={handleSelectDate}
          />
        </PopoverContent>
      </Popover>
    </FormField>
  );
};

export default DateField;