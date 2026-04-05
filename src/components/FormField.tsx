import { useMemo, useState, useEffect, forwardRef } from "react";
import { DayPicker } from "react-day-picker";
import { format, parseISO } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import "@/styles/pickers.css";

interface FormFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  name?: string;
  type?: "text" | "date" | "time" | "url";
  placeholder?: string;
  className?: string;
  error?: string;
  id?: string;
  required?: boolean;
}

const normalizeTime = (value: string) => {
  if (!value) return "";
  const segments = value.split(":");
  if (segments.length >= 2) {
    const hours = segments[0].padStart(2, "0").slice(0, 2);
    const minutes = segments[1].padStart(2, "0").slice(0, 2);
    return `${hours}:${minutes}`;
  }
  return value;
};

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      value,
      onChange,
      onBlur,
      name,
      type = "text",
      placeholder,
      className,
      error,
      id,
      required,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [internalTime, setInternalTime] = useState(() =>
      normalizeTime(value),
    );

    useEffect(() => {
      if (type === "time") {
        setInternalTime(normalizeTime(value));
      }
    }, [value, type]);

    const selectedDate = useMemo(() => {
      if (type !== "date" || !value) return undefined;
      try {
        return parseISO(value);
      } catch {
        return undefined;
      }
    }, [value, type]);

    const formattedDate = selectedDate
      ? format(selectedDate, "MMMM d, yyyy")
      : "";

    const errorId = id ? `${id}-error` : undefined;

    const renderInput = () => {
      switch (type) {
        case "date":
          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id={id}
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                    error && "border-destructive",
                  )}
                  aria-invalid={!!error}
                  aria-describedby={error ? errorId : undefined}
                  aria-required={required}
                >
                  <span>{formattedDate || placeholder || "Select date"}</span>
                  <Calendar
                    className="ml-2 h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 bg-background" align="start">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(day) => {
                    if (day) {
                      onChange(format(day, "yyyy-MM-dd"));
                      setOpen(false);
                    }
                  }}
                  defaultMonth={selectedDate}
                  weekStartsOn={1}
                  captionLayout="dropdown-buttons"
                  className="rdp-root"
                />
              </PopoverContent>
            </Popover>
          );

        case "time":
          return (
            <div className="relative">
              <div className="time-input-wrapper">
                <Input
                  id={id}
                  type="time"
                  value={internalTime}
                  onChange={(e) => {
                    const next = normalizeTime(e.target.value);
                    setInternalTime(next);
                    if (next.length === 5 || next === "") onChange(next);
                  }}
                  onBlur={onBlur}
                  name={name}
                  step={60}
                  className={cn("pr-10", error && "border-destructive")}
                  ref={ref}
                  aria-invalid={!!error}
                  aria-describedby={error ? errorId : undefined}
                  required={required}
                  aria-required={required}
                  {...props}
                />
                <Clock
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          );

        default:
          return (
            <Input
              id={id}
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              name={name}
              placeholder={placeholder}
              className={cn(error && "border-destructive")}
              ref={ref}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              required={required}
              aria-required={required}
              {...props}
            />
          );
      }
    };

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={id} className={cn(error && "text-destructive")}>
            {label}{" "}
            {required && (
              <span className="text-destructive" aria-hidden="true">
                *
              </span>
            )}
          </Label>
        )}
        {renderInput()}
        {error && (
          <p
            id={errorId}
            className="text-xs text-destructive font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";

export default FormField;
