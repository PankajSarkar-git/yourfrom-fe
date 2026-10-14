import React from "react";
import { Calendar as CalendarIcon, Clock, RotateCcw, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import Calendar, { formatDateToISO, parseISODate } from "../ui/calendar";
import FormField, { type FormFieldConfig } from "../FormBuilder/FormField";

interface DateTimeFieldProps {
  field: FormFieldConfig;
  value?: string; // stored as "YYYY-MM-DDTHH:mm"
  onChange: (value: string) => void;
  error?: string;
}

const DateTimeField: React.FC<DateTimeFieldProps> = ({
  field,
  value = "",
  onChange,
  error,
}) => {
  const [open, setOpen] = React.useState(false);

  // Split value into date and time
  const [datePart, timePart] = React.useMemo(() => {
    if (!value || !value.includes("T")) {
      return ["", "12:00"];
    }
    const parts = value.split("T");
    return [parts[0], parts[1] || "12:00"];
  }, [value]);

  const displayValue = React.useMemo(() => {
    if (!value || !datePart) return "";
    const d = parseISODate(datePart);
    if (!d) return value;

    const dateFormatted = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // Format time
    const [hStr, mStr] = timePart.split(":");
    let h = parseInt(hStr || "12", 10);
    const m = (mStr || "00").slice(0, 2);
    const period = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;

    return `${dateFormatted} at ${h}:${m} ${period}`;
  }, [value, datePart, timePart]);

  const handleSelectDate = (_date: Date | null, dateStr: string) => {
    if (!dateStr) {
      onChange("");
      return;
    }
    const currentT = timePart || "12:00";
    onChange(`${dateStr}T${currentT}`);
  };

  const handleTimeChange = (newTime: string) => {
    const curD = datePart || formatDateToISO(new Date());
    onChange(`${curD}T${newTime}`);
  };

  const handleNow = () => {
    const now = new Date();
    const dStr = formatDateToISO(now);
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    onChange(`${dStr}T${h}:${m}`);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const hoursList = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutesList = ["00", "15", "30", "45"];

  const currentH24 = parseInt(timePart.split(":")[0] || "12", 10);
  const currentPeriod = currentH24 >= 12 ? "PM" : "AM";
  let currentH12 = currentH24;
  if (currentH12 === 0) currentH12 = 12;
  else if (currentH12 > 12) currentH12 -= 12;
  const currentMin = (timePart.split(":")[1] || "00").slice(0, 2);

  const setHour = (h12: number) => {
    let h24 = h12;
    if (currentPeriod === "AM" && h12 === 12) h24 = 0;
    else if (currentPeriod === "PM" && h12 < 12) h24 = h12 + 12;
    handleTimeChange(`${String(h24).padStart(2, "0")}:${currentMin}`);
  };

  const setMinute = (min: string) => {
    handleTimeChange(`${String(currentH24).padStart(2, "0")}:${min}`);
  };

  const setPeriod = (p: "AM" | "PM") => {
    let h24 = currentH12;
    if (p === "AM" && currentH12 === 12) h24 = 0;
    else if (p === "PM" && currentH12 < 12) h24 = currentH12 + 12;
    handleTimeChange(`${String(h24).padStart(2, "0")}:${currentMin}`);
  };

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
              <CalendarIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className={displayValue ? "text-foreground font-medium" : "text-muted-foreground"}>
                {displayValue || field.placeholder || "Select date and time..."}
              </span>
            </div>

            {value && !field.disabled && !field.readOnly && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                title="Clear date and time"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 border shadow-2xl rounded-2xl overflow-hidden"
          align="start"
        >
          {/* Top Quick Actions */}
          <div className="flex items-center justify-between border-b px-4 py-2.5 bg-muted/30">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 text-primary" />
              Date & Time
            </span>
            <button
              type="button"
              onClick={handleNow}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Set to Now
            </button>
          </div>

          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border">
            {/* Left: Date Calendar */}
            <div className="p-1">
              <Calendar
                selected={datePart}
                onSelect={handleSelectDate}
              />
            </div>

            {/* Right: Time Selection Panel */}
            <div className="p-4 w-full sm:w-44 space-y-3 bg-muted/10">
              <span className="text-xs font-bold text-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Time
              </span>

              {/* Time columns */}
              <div className="grid grid-cols-3 gap-1.5 text-center">
                {/* Hours */}
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground">Hr</span>
                  <div className="h-36 overflow-y-auto rounded-md border bg-background p-0.5 space-y-0.5">
                    {hoursList.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setHour(h)}
                        className={`w-full py-0.5 text-xs rounded transition-colors ${
                          currentH12 === h
                            ? "bg-primary text-primary-foreground font-bold"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minutes */}
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground">Min</span>
                  <div className="h-36 overflow-y-auto rounded-md border bg-background p-0.5 space-y-0.5">
                    {minutesList.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMinute(m)}
                        className={`w-full py-0.5 text-xs rounded transition-colors ${
                          currentMin === m
                            ? "bg-primary text-primary-foreground font-bold"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AM/PM */}
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground">AM/PM</span>
                  <div className="h-36 flex flex-col justify-center rounded-md border bg-background p-0.5 gap-1">
                    {["AM", "PM"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPeriod(p as "AM" | "PM")}
                        className={`py-1.5 text-xs rounded font-bold transition-colors ${
                          currentPeriod === p
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={() => setOpen(false)}
                className="w-full text-xs h-7 mt-2"
              >
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </FormField>
  );
};

export default DateTimeField;