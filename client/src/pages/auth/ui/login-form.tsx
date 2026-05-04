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

const loginFormSchema = z.object({
  email: z.email().trim().min(1, { error: "Email is required" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" }),
});

export function LoginForm() {
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const authError = useAuthStore((state) => state.authError);
  const login = useAuthStore((state) => state.login);
  const clearAuthError = useAuthStore((state) => state.clearAuthError);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    await login({ email, password });
  });

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <AuthFormCard
        title="Sign In"
        description="Enter your email and password to login"
      >
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <AuthFormErrorAlert message={authError} />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
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
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="login-password"
                    aria-invalid={fieldState.invalid}
                    type="password"
                    placeholder="********"
                    autoComplete="current-password"
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
                {isAuthLoading ? "Sending..." : "Sign in"}
              </Button>
              <FieldDescription className="text-center">
                Don't have an account yet?{" "}
                <Link
                  className="underline-offset-4 hover:underline hover:text-chart-5"
                  to="/register"
                  onClick={clearAuthError}
                >
                  Sign Up
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </AuthFormCard>
    </div>
  );
}
