import * as z from "zod";

export const startedAtSchema = z
  .string()
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Please enter the correct date",
  })
  .refine((value) => new Date(value) > new Date(), {
    message: "Start date must be in the future",
  })
  .transform((value) => new Date(value).toISOString());
