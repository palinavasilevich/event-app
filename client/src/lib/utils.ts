import { isAxiosError } from "@/shared/api/http";
import type { ApiErrorResponse } from "@/shared/api/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getApiErrorMessage(
  error: unknown,
  message = "Something went wrong...",
): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;

    if (data && typeof data.message === "string") {
      return data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return message;
}
