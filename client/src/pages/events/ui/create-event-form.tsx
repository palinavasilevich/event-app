import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEventsStore } from "@/stores/events-store";
import { useNavigate } from "react-router-dom";
import { EventForm } from "./event-form";
import { format } from "date-fns";

type CreateEventFormProps = {
  className?: string;
};

const startedAtSchema = z
  .string()
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Please enter the correct date",
  })
  .refine((value) => new Date(value) > new Date(), {
    message: "Start date must be in the future",
  })
  .transform((value) => new Date(value).toISOString());

const createEventSchema = z.object({
  title: z.string().trim().min(1, { error: "Title is required" }).max(200),
  description: z.string().trim().min(1, { error: "Description is required" }),
  capacity: z
    .number()
    .int()
    .positive()
    .min(1, { error: "Capacity is required" })
    .max(300),
  address: z.string().trim().min(1, { error: "Address is required" }).max(255),
  startedAt: startedAtSchema,
});

export function CreateEventForm({ className }: CreateEventFormProps) {
  const navigate = useNavigate();
  const createEvent = useEventsStore((state) => state.createEvent);
  const clearError = useEventsStore((state) => state.clearError);
  const isMutationLoading = useEventsStore((state) => state.isMutationLoading);
  const eventsError = useEventsStore((state) => state.eventsError);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      capacity: 50,
      address: "",
      startedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const createdEvent = await createEvent(data);
    navigate(`/events/${createdEvent.id}`, { replace: true });
  });

  return (
    <EventForm
      title="Create event"
      form={form}
      subtitle="Fill in the event fields"
      backTo="/events"
      backLabel="Back"
      cancelTo="/events"
      submitLabel="Create event"
      submittingLabel="Creating..."
      error={eventsError}
      isLoading={isMutationLoading}
      className={className}
      onSubmit={onSubmit}
    />
  );
}
