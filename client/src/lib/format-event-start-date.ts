import { format, isValid, parseISO } from "date-fns";
import { enGB } from "date-fns/locale";

export const DATETIME_LOCAL_INPUT_FORMAT = "yyyy-MM-dd'T'HH:mm";

export function formatEventStartDate(iso: string) {
  const d = parseISO(iso);

  if (!isValid(d)) return iso;

  return format(d, "PPp", { locale: enGB });
}
