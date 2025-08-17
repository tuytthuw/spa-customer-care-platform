import { addMinutes, format, isSameDay, parseISO } from "date-fns";

export const toIso = (d: Date) => d.toISOString();
export const fromIso = (s: string) => parseISO(s);
export const hhmm = (iso: string) => format(parseISO(iso), "HH:mm");
export const ymd = (d: Date) => format(d, "yyyy-MM-dd");
export const isTodayIso = (iso: string) => isSameDay(parseISO(iso), new Date());
export const addMinIso = (iso: string, m: number) =>
  addMinutes(parseISO(iso), m).toISOString();
