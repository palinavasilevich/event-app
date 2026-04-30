import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .pipe(z.email({ message: "Invalid email" }))
  .transform((value) => value.toLowerCase());

export const registerSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100),
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { message: "Password required" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
