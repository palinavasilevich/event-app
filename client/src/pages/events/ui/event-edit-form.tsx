import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Navigate, generatePath, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEventsStore } from "@/stores/events-store";
import { useAuthStore } from "@/stores/auth-store";
import { useEventById } from "../hooks/use-event-by-id";
import { cn } from "@/lib/utils";
import { DATETIME_LOCAL_INPUT_FORMAT } from "@/lib/format-event-start-date";
import { format, isValid, parseISO } from "date-fns";
import { startedAtSchema } from "@/lib/event-schemas";
import { EventForm } from "./event-form";
import { Spinner } from "@/components/ui/spinner";

type EventEditFormProps = {
  className?: string;
};

const updateEventSchema = z.object({
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

export function EventEditForm({ className }: EventEditFormProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateEvent = useEventsStore((state) => state.updateEvent);
  const clearError = useEventsStore((state) => state.clearError);
  const isMutationLoading = useEventsStore((state) => state.isMutationLoading);
  const eventsError = useEventsStore((state) => state.eventsError);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const { event, isLoading, isNotFound, loadError } = useEventById(id);

  const form = useForm<z.infer<typeof updateEventSchema>>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      capacity: 50,
      startedAt: "",
      color: "#3b82f6",
    },
  });

  useEffect(() => {
    if (!event) return;
    const parsed = parseISO(event.startedAt);
    form.reset({
      title: event.title,
      description: event.description,
      address: event.address,
      capacity: event.capacity,
      startedAt: isValid(parsed)
        ? format(parsed, DATETIME_LOCAL_INPUT_FORMAT)
        : "",
      color: event.color ?? "#3b82f6",
    });
  }, [event, form]);

  if (!id) {
    return <Navigate to={ROUTES.EVENTS} replace />;
  }

  if (isLoading) {
    return (
      <div className={cn("flex justify-center items-center", className)}>
        <Spinner className="size-10" />
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className={cn("mx-auto w-full max-w-2xl space-y-6", className)}>
        <p className="text-sm">Event not found</p>
      </div>
    );
  }

  if (loadError || !event) {
    return (
      <div className={cn("mx-auto w-full max-w-2xl space-y-6", className)}>
        <p className="text-sm">Loading error</p>
      </div>
    );
  }

  if (!user || event.ownerId !== user.id) {
    return (
      <div className={cn("mx-auto w-full max-w-2xl space-y-6", className)}>
        <p className="text-sm">Only the organizer can edit</p>
      </div>
    );
  }

  const onSubmit = form.handleSubmit(async (data) => {
    await updateEvent(event.id, data);
    navigate(generatePath(ROUTES.EVENT, { id: event.id }), { replace: true });
  });

  return (
    <EventForm
      key={event.id}
      title="Edit event"
      form={form}
      subtitle="Change the fields and save"
      backTo={generatePath(ROUTES.EVENT, { id: event.id })}
      backLabel="Back to event"
      onCancel={() => navigate(generatePath(ROUTES.EVENT, { id: event.id }))}
      submitLabel="Save"
      submittingLabel="Saving..."
      error={eventsError}
      isLoading={isMutationLoading}
      className={className}
      onSubmit={onSubmit}
    />
  );
}
