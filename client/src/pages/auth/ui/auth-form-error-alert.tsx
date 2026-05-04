type AuthFormErrorAlertProps = {
  message: string | null | undefined;
};

export function AuthFormErrorAlert({ message }: AuthFormErrorAlertProps) {
  return (
    <p className="text-destructive text-sm" role="alert">
      {message}
    </p>
  );
}
