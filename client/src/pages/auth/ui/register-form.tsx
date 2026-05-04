import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/auth-store";
import { AuthFormCard } from "./auth-form-card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { AuthFormErrorAlert } from "./auth-form-error-alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const registerFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { error: "Name is required" })
      .min(2, { error: "Name must be at least 2 characters long" })
      .max(100),
    email: z.email().trim().min(1, { error: "Email is required" }),
    password: z
      .string()
      .min(1, { error: "Password is required" })
      .min(8, { error: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "The passwords do not match",
  });

export function RegisterForm() {
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const authError = useAuthStore((s) => s.authError);
  const register = useAuthStore((s) => s.register);

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async ({ email, password, name }) => {
    await register({ email, password, name });
  });

  const resetErrors = () => {
    useAuthStore.getState().clearAuthError();
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <AuthFormCard title="Sign up">
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <AuthFormErrorAlert message={authError} />
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="register-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Your name"
                    autoComplete="name"
                    disabled={isAuthLoading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="register-email"
                    aria-invalid={fieldState.invalid}
                    type="email"
                    placeholder="example@example.com"
                    autoComplete="email"
                    disabled={isAuthLoading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="register-password"
                    aria-invalid={fieldState.invalid}
                    type="password"
                    placeholder="********"
                    disabled={isAuthLoading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-confirm-password">
                    Confirm password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-confirm-password"
                    aria-invalid={fieldState.invalid}
                    type="password"
                    disabled={isAuthLoading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <Button type="submit" className="w-full" disabled={isAuthLoading}>
                {isAuthLoading ? "Sending..." : "Sign Up"}
              </Button>
              <FieldDescription className="text-center">
                Do you already have an account?{" "}
                <Link
                  className="underline-offset-4 hover:underline"
                  to="/login"
                  onClick={resetErrors}
                >
                  Sign in
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </AuthFormCard>
    </div>
  );
}
