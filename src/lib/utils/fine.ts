import { differenceInDays, parseISO, isAfter } from "date-fns";

export function getRemainingDays(dueDate: string): number {
  return differenceInDays(parseISO(dueDate), new Date());
}

export function calculateFine(dueDate: string, finePerDay: number): number {
  const due = parseISO(dueDate);
  if (!isAfter(new Date(), due)) return 0;
  return differenceInDays(new Date(), due) * finePerDay;
}
