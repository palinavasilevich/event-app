import z from "zod";

const startedAtSchema = z
  .string()
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "startedAt must be a valid ISO date",
  })
  .transform((value) => new Date(value));

export const createEventSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1),
  capacity: z.number().int().positive(),
  address: z.string().trim().min(1).max(255),
  startedAt: startedAtSchema,
});

export const updateEventSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).optional(),
    capacity: z.number().int().positive().optional(),
    address: z.string().trim().min(1).max(255).optional(),
    startedAt: startedAtSchema.optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "Please provide at least one editable field",
  });
