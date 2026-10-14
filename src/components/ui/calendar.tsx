import React from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "./button";

export interface CalendarProps {
  selected?: Date | string | null;
  onSelect?: (date: Date | null, dateString: string) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseISODate = (str?: string | null): Date | null => {
  if (!str) return null;
  const parts = str.split("-");
  if (parts.length < 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return new Date(year, month, day);
};

export const Calendar: React.FC<CalendarProps> = ({
  selected,
  onSelect,
  minDate,
  maxDate,
  className = "",
}) => {
  const selectedDate = React.useMemo(() => {
    if (!selected) return null;
    if (selected instanceof Date) return selected;
    return parseISODate(selected);
  }, [selected]);

  const [currentYear, setCurrentYear] = React.useState<number>(() => {
    return selectedDate ? selectedDate.getFullYear() : new Date().getFullYear();
  });

  const [currentMonth, setCurrentMonth] = React.useState<number>(() => {
    return selectedDate ? selectedDate.getMonth() : new Date().getMonth();
  });

  // Keep calendar view in sync when selected date changes externally
  React.useEffect(() => {
    if (selectedDate) {
      setCurrentYear(selectedDate.getFullYear());
      setCurrentMonth(selectedDate.getMonth());
    }
  }, [selectedDate]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Generate grid days
  const calendarDays = React.useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: {
      day: number;
      monthOffset: -1 | 0 | 1;
      date: Date;
      isToday: boolean;
      isSelected: boolean;
      isDisabled: boolean;
    }[] = [];

    const todayStr = formatDateToISO(new Date());
    const selStr = selectedDate ? formatDateToISO(selectedDate) : null;

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(currentYear, currentMonth - 1, dayNum);
      const iso = formatDateToISO(prevDate);
      days.push({
        day: dayNum,
        monthOffset: -1,
        date: prevDate,
        isToday: iso === todayStr,
        isSelected: iso === selStr,
        isDisabled: Boolean(
          (minDate && prevDate < minDate) || (maxDate && prevDate > maxDate)
        ),
      });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
      const curDate = new Date(currentYear, currentMonth, dayNum);
      const iso = formatDateToISO(curDate);
      days.push({
        day: dayNum,
        monthOffset: 0,
        date: curDate,
        isToday: iso === todayStr,
        isSelected: iso === selStr,
        isDisabled: Boolean(
          (minDate && curDate < minDate) || (maxDate && curDate > maxDate)
        ),
      });
    }

    // Next month filler days (fill to 35 or 42 cells)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const nextDate = new Date(currentYear, currentMonth + 1, dayNum);
      const iso = formatDateToISO(nextDate);
      days.push({
        day: dayNum,
        monthOffset: 1,
        date: nextDate,
        isToday: iso === todayStr,
        isSelected: iso === selStr,
        isDisabled: Boolean(
          (minDate && nextDate < minDate) || (maxDate && nextDate > maxDate)
        ),
      });
    }

    return days;
  }, [currentYear, currentMonth, selectedDate, minDate, maxDate]);

  const handleSelectDay = (dayItem: (typeof calendarDays)[0]) => {
    if (dayItem.isDisabled) return;
    const isoString = formatDateToISO(dayItem.date);
    onSelect?.(dayItem.date, isoString);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    onSelect?.(today, formatDateToISO(today));
  };

  const handleClear = () => {
    onSelect?.(null, "");
  };

  // Year range options for selector
  const yearOptions = React.useMemo(() => {
    const years: number[] = [];
    const baseYear = new Date().getFullYear();
    for (let y = baseYear - 50; y <= baseYear + 20; y++) {
      years.push(y);
    }
    return years;
  }, []);

  return (
    <div className={`p-3 select-none w-[280px] bg-popover text-popover-foreground ${className}`}>
      {/* Month & Year Navigation Header */}
      <div className="flex items-center justify-between gap-1 pb-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={prevMonth}
          className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Dropdowns for Month & Year */}
        <div className="flex items-center gap-1">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value, 10))}
            className="h-7 rounded-md border border-input bg-background px-1.5 py-0.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx}>
                {name.slice(0, 3)}
              </option>
            ))}
          </select>

          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value, 10))}
            className="h-7 rounded-md border border-input bg-background px-1.5 py-0.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="h-7 flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((item, index) => {
          const isOtherMonth = item.monthOffset !== 0;

          return (
            <button
              key={`${item.date.toISOString()}-${index}`}
              type="button"
              disabled={item.isDisabled}
              onClick={() => handleSelectDay(item)}
              className={`h-8 w-8 text-xs font-medium rounded-lg flex items-center justify-center transition-all ${
                item.isSelected
                  ? "bg-primary text-primary-foreground font-bold shadow-xs hover:bg-primary/90"
                  : item.isToday
                    ? "border border-primary text-primary font-bold hover:bg-primary/10"
                    : isOtherMonth
                      ? "text-muted-foreground/35 hover:bg-muted/50"
                      : "text-foreground hover:bg-muted"
              } ${item.isDisabled ? "opacity-25 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {item.day}
            </button>
          );
        })}
      </div>

      {/* Quick Actions Footer */}
      <div className="flex items-center justify-between border-t border-border/60 pt-2.5 mt-2.5 text-xs">
        <button
          type="button"
          onClick={handleToday}
          className="font-semibold text-primary hover:underline flex items-center gap-1 text-[11px]"
        >
          <RotateCcw className="h-3 w-3" />
          Today
        </button>

        {selectedDate && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default Calendar;
