import React from "react";
import { Star } from "lucide-react";

import FormField, {
  type FormFieldConfig,
} from "../FormBuilder/FormField";

interface RatingFieldProps {
  field: FormFieldConfig;
  value?: number;
  onChange: (value: number) => void;
  error?: string;
}

const RatingField = ({
  field,
  value = 0,
  onChange,
  error,
}: RatingFieldProps) => {
  const min = field.validation?.min ?? 1;
  const max = field.validation?.max ?? 5;

  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const safeMax = Math.max(max, min);
  const safeValue = Math.min(
    Math.max(value, min - 1),
    safeMax
  );

  const displayRating = hoverRating !== null ? hoverRating : safeValue;

  const handleRatingChange = (rating: number) => {
    if (field.disabled || field.readOnly) return;
    onChange(rating);
  };

  return (
    <FormField field={field} error={error}>
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/20 border border-border/40 w-fit"
          role="radiogroup"
          aria-label={field.label}
          onMouseLeave={() => setHoverRating(null)}
        >
          {Array.from({ length: safeMax - min + 1 }, (_, index) => {
            const rating = index + min;
            const isActive = rating <= displayRating;

            return (
              <button
                key={rating}
                type="button"
                role="radio"
                aria-label={`${rating} out of ${safeMax}`}
                aria-checked={rating === safeValue}
                disabled={field.disabled}
                tabIndex={field.readOnly ? -1 : 0}
                onMouseEnter={() => !field.disabled && !field.readOnly && setHoverRating(rating)}
                onClick={() => handleRatingChange(rating)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleRatingChange(rating);
                  }
                }}
                className={`p-1 rounded-lg outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-amber-500/50 ${
                  field.disabled || field.readOnly
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:scale-115 active:scale-95"
                }`}
              >
                <Star
                  className={`h-7 w-7 transition-colors duration-150 ${
                    isActive
                      ? "fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.35)]"
                      : "fill-transparent text-muted-foreground/30 hover:text-amber-300"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
        </div>

        {safeValue > 0 && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 animate-in fade-in">
            {safeValue} / {safeMax}
          </span>
        )}
      </div>
    </FormField>
  );
};

export default RatingField;