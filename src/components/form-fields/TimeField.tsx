import React from "react";
import { Clock, RotateCcw, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import FormField, { type FormFieldConfig } from "../FormBuilder/FormField";

interface TimeFieldProps {
  field: FormFieldConfig;
  value?: string; // stored as "HH:mm" (24h)
  onChange: (value: string) => void;
  error?: string;
}

const TIME_PRESETS = [
  { label: "Morning (09:00)", value: "09:00" },
  { label: "Noon (12:00)", value: "12:00" },
  { label: "Afternoon (14:30)", value: "14:30" },
  { label: "Evening (18:00)", value: "18:00" },
];

const TimeField: React.FC<TimeFieldProps> = ({
  field,
  value = "",
  onChange,
  error,
}) => {
  const [open, setOpen] = React.useState(false);

  // Parse 24h "HH:mm" into 12h parts
  const parsedTime = React.useMemo(() => {
    if (!value || !value.includes(":")) {
      return { hours: "12", minutes: "00", period: "PM" };
    }
    const [hStr, mStr] = value.split(":");
    let h = parseInt(hStr, 10);
    const m = mStr.slice(0, 2);
    const period = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return {
      hours: String(h).padStart(2, "0"),
      minutes: m,
      period,
    };
  }, [value]);

  const displayTime = React.useMemo(() => {
    if (!value) return "";
    return `${parsedTime.hours}:${parsedTime.minutes} ${parsedTime.period}`;
  }, [value, parsedTime]);

  const updateTime = (h12: number, min: string, period: "AM" | "PM") => {
    let h24 = h12;
    if (period === "AM" && h12 === 12) h24 = 0;
    else if (period === "PM" && h12 < 12) h24 = h12 + 12;

    const valStr = `${String(h24).padStart(2, "0")}:${min}`;
    onChange(valStr);
  };

  const handleNow = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    onChange(`${h}:${m}`);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const hoursList = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutesList = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

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
              <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className={displayTime ? "text-foreground font-medium" : "text-muted-foreground"}>
                {displayTime || field.placeholder || "Select time..."}
              </span>
            </div>

            {value && !field.disabled && !field.readOnly && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                title="Clear time"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-72 p-3 space-y-3 border shadow-xl rounded-2xl" align="start">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-xs font-bold text-foreground">Select Time</span>
            <button
              type="button"
              onClick={handleNow}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Now
            </button>
          </div>

          {/* Time Picker Wheel / Column Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Hours */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Hour</span>
              <div className="h-40 overflow-y-auto rounded-lg border bg-muted/20 p-1 space-y-1">
                {hoursList.map((h) => {
                  const isSel = parseInt(parsedTime.hours, 10) === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() =>
                        updateTime(h, parsedTime.minutes, parsedTime.period as "AM" | "PM")
                      }
                      className={`w-full py-1 text-xs rounded-md transition-colors ${
                        isSel
                          ? "bg-primary text-primary-foreground font-bold"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minutes */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Min</span>
              <div className="h-40 overflow-y-auto rounded-lg border bg-muted/20 p-1 space-y-1">
                {minutesList.map((m) => {
                  const isSel = parsedTime.minutes === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() =>
                        updateTime(
                          parseInt(parsedTime.hours, 10),
                          m,
                          parsedTime.period as "AM" | "PM"
                        )
                      }
                      className={`w-full py-1 text-xs rounded-md transition-colors ${
                        isSel
                          ? "bg-primary text-primary-foreground font-bold"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AM / PM */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">AM/PM</span>
              <div className="h-40 flex flex-col justify-center rounded-lg border bg-muted/20 p-1 gap-2">
                {["AM", "PM"].map((p) => {
                  const isSel = parsedTime.period === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() =>
                        updateTime(
                          parseInt(parsedTime.hours, 10),
                          parsedTime.minutes,
                          p as "AM" | "PM"
                        )
                      }
                      className={`py-2 text-xs rounded-md font-bold transition-colors ${
                        isSel
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2 border-t flex flex-wrap gap-1">
            {TIME_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => {
                  onChange(preset.value);
                  setOpen(false);
                }}
                className="text-[10px] font-medium rounded border bg-muted/40 px-2 py-0.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                {preset.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </FormField>
  );
};

export default TimeField;