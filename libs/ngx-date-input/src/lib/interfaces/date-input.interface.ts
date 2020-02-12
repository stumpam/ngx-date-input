export interface TokenConfig {
  [key: string]: {
    min: number;
    max: number;
    role: TokenRole;
    leadingZero?: boolean;
  };
}

export interface Token {
  role: TokenRole;
  pattern?: string;
  min?: number;
  max?: number;
  value?: string;
  valid?: boolean;
  leadingZero?: boolean;
}

export const enum TokenRole {
  divider,
  day,
  month,
  year,
}
