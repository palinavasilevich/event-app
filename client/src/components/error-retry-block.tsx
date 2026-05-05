import { cn } from "@/lib/utils";

type ErrorRetryBlockProps = {
  message: string;
  className?: string;
};

export function ErrorRetryBlock({ message, className }: ErrorRetryBlockProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
}
