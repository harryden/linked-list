import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import "@/styles/pickers.css";

interface TimePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
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

const TimePickerField = ({ value, onChange, className, id }: TimePickerFieldProps) => {
  const [internalValue, setInternalValue] = useState(() => normalizeTime(value));

  useEffect(() => {
    setInternalValue(normalizeTime(value));
  }, [value]);

  const handleChange = (next: string) => {
    const normalized = normalizeTime(next);
    setInternalValue(normalized);

    if (normalized.length === 5) {
      onChange(normalized);
    }
  };

  return (
    <div className={cn("time-input-wrapper", className)}>
      <input
        id={id}
        type="time"
        value={internalValue}
        onChange={(event) => handleChange(event.target.value)}
        step={60}
      />
    </div>
  );
};

export default TimePickerField;
