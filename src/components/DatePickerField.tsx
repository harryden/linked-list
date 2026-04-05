import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parseISO } from "date-fns";
import { Calendar } from "lucide-react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "@/styles/pickers.css";

interface DatePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

const DatePickerField = ({
  value,
  onChange,
  placeholder,
  className,
  id,
}: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false);

  const selectedDate = useMemo(() => {
    if (!value) {
      return undefined;
    }

    try {
      return parseISO(value);
    } catch (error) {
      return undefined;
    }
  }, [value]);

  const formatted = selectedDate ? format(selectedDate, "MMMM d, yyyy") : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className,
          )}
        >
          <span>{formatted || placeholder || "Select date"}</span>
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
};

export default DatePickerField;
