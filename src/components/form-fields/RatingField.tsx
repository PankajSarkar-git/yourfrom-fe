
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

  const safeMax = Math.max(max, min);
  const safeValue = Math.min(
    Math.max(value, min - 1),
    safeMax
  );

  const handleRatingChange = (
    rating: number
  ) => {
    if (
      field.disabled ||
      field.readOnly
    ) {
      return;
    }

    onChange(rating);
  };

  return (
    <FormField
      field={field}
      error={error}
    >
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label={field.label}
      >
        {Array.from(
          { length: safeMax - min + 1 },
          (_, index) => {
            const rating = index + min;
            const isActive =
              rating <= safeValue;

            return (
              <button
                key={rating}
                type="button"
                role="radio"
                aria-label={`${rating} out of ${safeMax}`}
                aria-checked={
                  rating === safeValue
                }
                disabled={
                  field.disabled
                }
                tabIndex={
                  field.readOnly
                    ? -1
                    : 0
                }
                onClick={() =>
                  handleRatingChange(
                    rating
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                      "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();

                    handleRatingChange(
                      rating
                    );
                  }
                }}
                className={`rounded-sm outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring ${
                  field.disabled ||
                  field.readOnly
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:opacity-80"
                }`}
              >
                <Star
                  className="h-6 w-6"
                  fill={
                    isActive
                      ? "currentColor"
                      : "none"
                  }
                  strokeWidth={1.5}
                />
              </button>
            );
          }
        )}
      </div>
    </FormField>
  );
};

export default RatingField;