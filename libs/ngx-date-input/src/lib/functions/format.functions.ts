export const padStart = (
  str: string | number,
  length: number,
  char: string = '0',
) => {
  str = str.toString();
  console.log(str);
  return str.length < length
    ? char + (str.length === 0 && length === 2 ? char : '') + str
    : str;
};
