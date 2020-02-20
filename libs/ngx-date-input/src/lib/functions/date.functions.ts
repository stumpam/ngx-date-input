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
