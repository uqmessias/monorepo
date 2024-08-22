export type NumeroFormatado<T extends Record<string, number>> = {
  [P in keyof T]: T[P] extends number
    ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
      P extends `valor${infer _}` | `percentual${infer _}` | `meses${infer _}`
      ? string
      : T[P]
    : T[P];
};

export type CalculoFormatado<T extends Record<string, number>> =
  NumeroFormatado<T>;

export type FormatNumber<T extends Record<string, number>> = (
  objetoComNumero: T
) => CalculoFormatado<T>;

export function formatMoney(num: number): string;
export function formatMonths(num: number): string;
export function formatNumber<T>(num: number): FormatNumber<T>;
export function formatPercentage(num: number): string;
