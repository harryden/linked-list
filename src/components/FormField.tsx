import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import DatePickerField from "./DatePickerField";
import TimePickerField from "./TimePickerField";

interface FormFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  type?: "text" | "date" | "time" | "url";
  placeholder?: string;
  className?: string;
  error?: string;
  id?: string;
  required?: boolean;
}

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
    const errorId = id ? `${id}-error` : undefined;

    const renderInput = () => {
      switch (type) {
        case "date":
          return (
            <DatePickerField
              id={id}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              error={!!error}
              required={required}
              aria-describedby={error ? errorId : undefined}
            />
          );

        case "time":
          return (
            <TimePickerField
              ref={ref}
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!error}
              required={required}
              aria-describedby={error ? errorId : undefined}
            />
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
