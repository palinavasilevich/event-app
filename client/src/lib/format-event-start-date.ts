import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function formatEventStartDate(iso: string) {
  const d = parseISO(iso);

  if (!isValid(d)) return iso;

  return format(d, "PPp", { locale: es });
}
