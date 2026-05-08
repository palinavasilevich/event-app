import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEventsStore } from "@/stores/events-store";
import { generatePath, useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { startedAtSchema } from "@/lib/event-schemas";
import { EventForm } from "./event-form";
import { format } from "date-fns";
import { DATETIME_LOCAL_INPUT_FORMAT } from "@/lib/format-event-start-date";

type CreateEventFormProps = {
  className?: string;
};

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
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
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
      startedAt: format(new Date(), DATETIME_LOCAL_INPUT_FORMAT),
      color: "#3b82f6",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const createdEvent = await createEvent(data);
    navigate(generatePath(ROUTES.EVENT, { id: createdEvent.id }), { replace: true });
  });

  return (
    <EventForm
      title="Create event"
      form={form}
      subtitle="Fill in the event fields"
      backTo={ROUTES.EVENTS}
      backLabel="Back"
      onCancel={() => navigate(ROUTES.EVENTS)}
      submitLabel="Create event"
      submittingLabel="Creating..."
      error={eventsError}
      isLoading={isMutationLoading}
      className={className}
      onSubmit={onSubmit}
    />
  );
}
