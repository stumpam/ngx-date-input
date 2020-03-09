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

export interface DateInputOptions {
  tokens?: TokenConfig;
  format: string;
  min?: string | Date;
  max?: string | Date;
  disableWeekends?: boolean;
  hideOtherMonths?: boolean;
  iso?: boolean;
  months?: string[];
  days?: string[];
  image?: string;
  disableOtherMonths?: boolean;
  view?: CalendarView;
}

export type CalendarView = 'month' | 'year' | 'decade';
