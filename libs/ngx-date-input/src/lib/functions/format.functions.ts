export const padStart = (
  str: string | number,
  length: number = 2,
  char: string = '0',
) => {
  str = str.toString();

  return str.length < length
    ? char + (str.length === 0 && length === 2 ? char : '') + str
    : str;
};
