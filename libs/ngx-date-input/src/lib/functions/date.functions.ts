export const normalizeDate = (date: string | Date) => {
  if (!date) return;

  let normalizedDate: Date;

  if (typeof date === 'string') {
    normalizedDate = new Date(date);
  } else {
    normalizedDate = date;
  }
  normalizedDate.setHours(0, 0, 0, 0);

  return normalizedDate;
};

export function lastDayOfNextMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 2, 0);
}

export function firstDayOfPreviousMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

export function isDateBefore(first: Date, second: Date): boolean {
  return first.getTime() < second.getTime() && !isDateEqual(first, second);
}

export function isDateAfter(first: Date, second: Date): boolean {
  return first.getTime() > second.getTime() && !isDateEqual(first, second);
}

function isDateEqual(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() == second.getDate()
  );
}
