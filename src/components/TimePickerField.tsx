import { useEffect, useState, forwardRef } from "react";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import "@/styles/pickers.css";

interface TimePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  className?: string;
  id?: string;
  error?: boolean;
  required?: boolean;
  "aria-describedby"?: string;
}

const normalizeTime = (value: string) => {
  if (!value) {
    return "";
  }

  const segments = value.split(":");

  if (segments.length >= 2) {
    const hours = segments[0].padStart(2, "0").slice(0, 2);
    const minutes = segments[1].padStart(2, "0").slice(0, 2);
    return `${hours}:${minutes}`;
  }

  return value;
};

const TimePickerField = forwardRef<HTMLInputElement, TimePickerFieldProps>(
  (
    {
      value,
      onChange,
      onBlur,
      name,
      className,
      id,
      error,
      required,
      "aria-describedby": ariaDescribedby,
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(() =>
      normalizeTime(value),
    );

    useEffect(() => {
      setInternalValue(normalizeTime(value));
    }, [value]);

    const handleChange = (next: string) => {
      const normalized = normalizeTime(next);
      setInternalValue(normalized);

      if (normalized.length === 5 || normalized === "") {
        onChange(normalized);
      }
    };

    return (
      <div className="relative">
        <div className="time-input-wrapper">
          <Input
            ref={ref}
            id={id}
            name={name}
            type="time"
            value={internalValue}
            onChange={(event) => handleChange(event.target.value)}
            onBlur={onBlur}
            step={60}
            className={cn("pr-10", error && "border-destructive", className)}
            aria-invalid={error}
            aria-describedby={ariaDescribedby}
            required={required}
            aria-required={required}
          />
          <Clock
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
    );
  },
);

TimePickerField.displayName = "TimePickerField";

export default TimePickerField;
