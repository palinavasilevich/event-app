import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { EventsQueryParams } from "@/shared/api/events/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar, SearchIcon, XIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import z from "zod";
import { CalendarRange } from "./calendar-range";

type EventFilterFormProps = {
  isLoading: boolean;
  className?: string;
  onSubmit: (params: EventsQueryParams) => void;
  debounceMs?: number;
};

const eventFilterSchema = z
  .object({
    search: z.string().trim().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    { message: "End date must be on or after start date", path: ["endDate"] },
  );

export function EventFilterForm({
  isLoading,
  className,
  onSubmit,
  debounceMs = 400,
}: EventFilterFormProps) {
  const form = useForm<z.infer<typeof eventFilterSchema>>({
    resolver: zodResolver(eventFilterSchema),
    mode: "onChange",
    defaultValues: {
      search: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: "",
    },
  });

  const [isShowCalendar, setShowCalendar] = useState(false);
  const watchedStartDate = useWatch({ control: form.control, name: "startDate" });
  const watchedEndDate = useWatch({ control: form.control, name: "endDate" });

  const onSubmitRef = useRef(onSubmit);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  });

  useEffect(() => {
    const { search, startDate, endDate } = form.getValues();
    onSubmitRef.current({
      search: search?.trim() || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleSubmit = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      form.handleSubmit((data) => {
        onSubmitRef.current({
          search: data.search?.trim() || undefined,
          startDate: data.startDate || undefined,
          endDate: data.endDate || undefined,
        });
      })();
    }, debounceMs);
  }, [debounceMs, form]);

  const handleSubmit = useCallback(
    async (e?: React.BaseSyntheticEvent) => {
      clearTimeout(timerRef.current);
      await form.handleSubmit((data) => {
        onSubmitRef.current({
          search: data.search?.trim() || undefined,
          startDate: data.startDate || undefined,
          endDate: data.endDate || undefined,
        });
      })(e);
    },
    [form],
  );

  const handleClear = () => {
    clearTimeout(timerRef.current);
    form.reset();
    const { startDate, endDate } = form.getValues();
    onSubmit({ startDate, endDate });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full max-w-7xl flex justify-between gap-4 relative",
        className,
      )}
    >
      <label htmlFor="event-search" className="sr-only">
        Search events
      </label>
      <Controller
        name="search"
        control={form.control}
        render={({ field }) => (
          <ButtonGroup className="w-full ">
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                scheduleSubmit();
              }}
              id="event-search"
              placeholder="Search..."
            />
            {field.value && (
              <Button
                variant="outline"
                type="button"
                aria-label="Clear search"
                onClick={handleClear}
                disabled={isLoading}
              >
                <XIcon />
              </Button>
            )}
            <Button
              variant="outline"
              aria-label="Search"
              type="submit"
              disabled={isLoading}
            >
              <SearchIcon />
            </Button>
          </ButtonGroup>
        )}
      />
      <Button
        variant="outline"
        type="button"
        aria-label="Toggle Calendar"
        onClick={() => setShowCalendar((prev) => !prev)}
      >
        <Calendar />
      </Button>
      {isShowCalendar && (
        <CalendarRange
          className="absolute right-0 top-9 z-10"
          value={{
            from: watchedStartDate ? new Date(watchedStartDate) : undefined,
            to: watchedEndDate ? new Date(watchedEndDate) : undefined,
          }}
          onChange={(range) => {
            form.setValue(
              "startDate",
              range?.from ? format(range.from, "yyyy-MM-dd") : "",
            );
            form.setValue(
              "endDate",
              range?.to ? format(range.to, "yyyy-MM-dd") : "",
            );
            scheduleSubmit();
          }}
        />
      )}
    </form>
  );
}
