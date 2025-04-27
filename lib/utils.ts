import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale = "en-US"): string {
  const dateObj = new Date(date);

  if (locale === "pt-BR") {
    return format(dateObj, "dd 'de' MMM 'de' yyyy", { locale: ptBR });
  }

  return format(dateObj, "MMM d, yyyy");
}

export function formatDateForInput(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export function formatDistanceToNow(
  date: Date | string,
  locale = "en-US"
): string {
  const dateObj = new Date(date);

  if (locale === "pt-BR") {
    return formatDistanceToNowStrict(dateObj, {
      addSuffix: true,
      locale: ptBR,
    });
  }

  return formatDistanceToNowStrict(dateObj, {
    addSuffix: true,
  });
}
