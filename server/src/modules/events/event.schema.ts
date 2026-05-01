import z from "zod";

const startedAtSchema = z
  .string()
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "startsAt must be a valid ISO date",
  })
  .transform((value) => new Date(value));

export const createEventSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1),
  capacity: z.number().int().positive(),
  address: z.string().trim().min(1).max(255),
  startedAt: startedAtSchema,
});
