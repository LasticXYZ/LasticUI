export function joinClassNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Utility function for parsing numbers
export const parseFormattedNumber = (str?: string | number): number => {
  if (!str) return 0;
  return typeof str === 'number' ? str : parseInt(str.replace(/,/g, ''), 10);
};