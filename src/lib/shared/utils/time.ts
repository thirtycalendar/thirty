export function combineDateTimeUTC(date: string, time: string): Date {
  return new Date(`${date}T${time}Z`);
}
