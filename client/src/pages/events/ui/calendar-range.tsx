import { useState } from "react";
import { addDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type CalendarRangeProps = {
  className?: string;
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
};

export function CalendarRange({
  className,
  value,
  onChange,
}: CalendarRangeProps) {
  const [internalRange, setInternalRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 12),
    to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
  });

  const dateRange = value !== undefined ? value : internalRange;
  const handleSelect = onChange ?? setInternalRange;

  return (
    <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={handleSelect}
      numberOfMonths={2}
      className={cn("rounded-lg border", className)}
    />
  );
}
