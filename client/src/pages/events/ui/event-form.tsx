import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CreateEventRequest } from "@/shared/api/events/types";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

type EventFormValues = CreateEventRequest;

type EventFormProps = {
  title: string;
  subtitle: string;
  backTo: string;
  backLabel: string;
  onCancel: () => void;
  submitLabel: string;
  submittingLabel: string;
  form: UseFormReturn<EventFormValues>;
  selectedColor?: string | null;
  onColorChange: (color: string) => void;
  error?: string | null;
  isLoading?: boolean;
  className?: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

export function EventForm({
  title,
  subtitle,
  backTo,
  backLabel,
  onCancel,
  submitLabel,
  submittingLabel,
  form,
  selectedColor,
  onColorChange,
  error,
  isLoading,
  className,
  onSubmit,
}: EventFormProps) {
  return (
    <div className={cn("w-full max-w-2xl space-y-4", className)}>
      <div className="space-y-1">
        <Button variant="outline" asChild size="sm">
          <Link to={backTo}>
            <ArrowLeftIcon className="size-4" />
            {backLabel}
          </Link>
        </Button>
        <div className="text-center">
          <h1 className="font-heading text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <Card>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-6 pt-6">
            {error && <p className="text-sm text-destructive">{error}</p>}

            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="event-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter the event title"
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-description">
                      Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="event-description"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter the event description"
                      rows={5}
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="startedAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-startedAt">
                      Start date and time
                    </FieldLabel>
                    <Input
                      {...field}
                      id="event-startedAt"
                      aria-invalid={fieldState.invalid}
                      type="datetime-local"
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-address">Address</FieldLabel>
                    <Input
                      {...field}
                      id="event-address"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter the event address"
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="capacity"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between gap-4">
                      <FieldLabel
                        htmlFor="capacity-slider"
                        className="inline-flex items-center gap-2"
                      >
                        Capacity
                      </FieldLabel>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {field.value}
                      </span>
                    </div>
                    <Slider
                      id="capacity-slider"
                      min={1}
                      max={300}
                      step={1}
                      value={[field.value ?? 1]}
                      onValueChange={(v) => field.onChange(v[0] ?? 1)}
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <FieldLabel>Color</FieldLabel>
                <div className="flex gap-2 mb-4">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={cn(
                        "relative size-7 rounded-full border-2 transition-transform focus:outline-none",
                        selectedColor === color
                          ? "border-foreground scale-110"
                          : "border-transparent hover:scale-105",
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => onColorChange(color)}
                      disabled={isLoading}
                      aria-label={color}
                    >
                      {selectedColor === color && (
                        <CheckIcon className="absolute inset-0 m-auto size-3.5 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter className="justify-end gap-2 border-t">
            <Button
              variant="ghost"
              type="button"
              disabled={isLoading}
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? submittingLabel : submitLabel}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
