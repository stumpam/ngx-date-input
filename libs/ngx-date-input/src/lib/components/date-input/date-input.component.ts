import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';

import {
  DateInputOptions,
  Token,
  TokenConfig,
  TokenRole,
} from '../../interfaces/date-input.interface';

export const DATE_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateInputComponent),
  multi: true,
};

@Component({
  selector: 'ngx-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '(click)': 'onClick()',
    '(input)': 'onInput($event.target.value)',
    '(keydown)': 'onKeyDown($event)',
    '[class.ngx-date-input]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [DATE_INPUT_VALUE_ACCESSOR],
})
export class DateInputComponent implements ControlValueAccessor, OnDestroy {
  @ViewChild('field', { static: true }) field: ElementRef<HTMLInputElement>;
  @Input() set options(options: DateInputOptions) {
    this.format = options.format;
    this._options = options;
    this.iso = !!options.iso;

    if (options.tokens) {
      this.tokens = options.tokens;
    }

    if (options.min) {
      this.min = options.min;
    }

    if (options.max) {
      this.max = options.max;
    }
  }

  _options: DateInputOptions = {} as DateInputOptions;

  tokens: TokenConfig = {
    yyyy: {
      min: 1900,
      max: 2100,
      role: TokenRole.year,
    },
    dd: {
      min: 1,
      max: 31,
      role: TokenRole.day,
      leadingZero: true,
    },
    MM: {
      min: 1,
      max: 12,
      role: TokenRole.month,
      leadingZero: true,
    },
    d: {
      min: 1,
      max: 31,
      role: TokenRole.day,
      leadingZero: false,
    },
    M: {
      min: 1,
      max: 12,
      role: TokenRole.month,
      leadingZero: false,
    },
  };

  set format(format: string) {
    this.sections = parseString(format, this.tokens);
  }

  max = '';
  min = '';
  iso = false;

  showCalendar = false;

  get cursorPosition() {
    return this.field.nativeElement.selectionStart;
  }

  get cursorPositionEnd() {
    return this.field.nativeElement.selectionEnd;
  }

  sections: Token[] = [];
  prevValue = '';
  date: Date | undefined;
  prevDate: Date | undefined;

  private readonly destroy$ = new Subject<void>();
  touchedFn: any = null;
  changeFn: any = null;
  disabled = false;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly renderer: Renderer2,
    private readonly el: ElementRef,
  ) {}

  setDate(date: Date) {
    this.prevDate = date;
    this.updateDateSection(date, true);
    const value = this.buildString();
    this.onInput(value);
  }

  writeValue(obj: string | Date): void {
    if (obj instanceof Date) {
      this.setDate(obj);
      return;
    }
    this.renderer.setProperty(this.field.nativeElement, 'value', obj);
  }

  registerOnChange(fn: any): void {
    this.changeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.touchedFn = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cd.markForCheck();
  }

  onClick() {
    this.updateSection('none');
    this.touchedFn?.();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      if (
        this.cursorPosition === 0 &&
        this.cursorPositionEnd === this.field.nativeElement.value.length
      ) {
        this.min ? this.setDate(new Date(this.min)) : this.onInput('');

        return;
      }
      event.preventDefault();
    }
    if (
      event.key === 'Backspace' &&
      this.cursorPosition !== this.field.nativeElement.value.length
    ) {
      if (
        this.cursorPosition === 0 &&
        this.cursorPositionEnd === this.field.nativeElement.value.length
      ) {
        this.min ? this.setDate(new Date(this.min)) : this.onInput('');

        return;
      }
      event.preventDefault();
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.updateSection(event.key);
    }
  }

  updateSection(key: 'ArrowUp' | 'ArrowDown' | 'none') {
    if (!this.date) return;

    let pos = this.cursorPosition;
    let right = pos;
    let index = 0;
    let active = true;

    const value = this.sections.reduce((str, section) => {
      let sectionValue = section.value;
      if (active && pos >= index && pos <= section.value.length + index) {
        if (section.role !== TokenRole.divider) {
          if (key !== 'none') {
            const orig = +section.value;
            let num = key === 'ArrowUp' ? orig + 1 : orig - 1;

            if (num > section.max) num--;
            if (num < section.min) num++;

            sectionValue = num
              .toString()
              .padStart(section.leadingZero ? 2 : 1, '0');
          }

          pos = index;
          right = index + sectionValue.length;

          active = false;
        } else {
          pos = pos + 1;
        }
      }
      index = index + section.value.length;
      return str + sectionValue;
    }, '');

    if (key !== 'none') {
      this.onInput(value);
    }
    this.field.nativeElement.setSelectionRange(pos, right);
  }

  onInput(value: string | Date) {
    if (!value || (typeof value === 'string' && value.length === 1)) {
      this.resetSections();
    }

    if (value instanceof Date) {
      this.setDate(value);

      return;
    }

    const back = this.prevValue.length > value.length;

    if (!value) {
      this.sections[0].value = '';
      this.sections[0].valid = false;
    }

    this.getSection(value, 0, back);

    const { year, month, day } = this.sections.reduce(
      (prev, curr) => {
        if (!curr.valid) return prev;
        if (curr.role === TokenRole.day) prev.day = curr.value;
        if (curr.role === TokenRole.month) prev.month = curr.value;
        if (curr.role === TokenRole.year) prev.year = curr.value;
        return prev;
      },
      { day: '', month: '', year: '' },
    );

    let checkedDay = day;
    if (year && month && day) {
      const date = new Date(+year, +month, 0).getDate();
      if (+day > date) {
        const section = this.sections.find(s => s.role === TokenRole.day);
        section.value = date.toString();
        checkedDay = section.value;
      }
    }

    if (year && month && checkedDay) {
      this.prevDate = this.date;
      this.date = new Date(`${year}-${month}-${checkedDay}`);
    } else {
      this.prevDate = this.date;
      this.date = undefined;
    }

    if (this.min && this.date && new Date(this.min) > this.date) {
      this.updateDateSection(new Date(this.min));
    }

    if (this.max && this.date && new Date(this.max) < this.date) {
      this.updateDateSection(new Date(this.max));
    }

    value = this.buildString();
    this.updateValue(value);
  }

  updateValue(value: string) {
    this.writeValue(value);
    if (this.date !== this.prevDate) {
      this.changeFn?.(
        (this.date &&
          (this.iso
            ? new Date(
                this.date.getTime() - this.date.getTimezoneOffset() * 60000,
              )
                .toISOString()
                .split('T')[0]
            : this.date)) ||
          null,
      );
    }

    this.prevValue = value;
  }

  resetSections() {
    this.sections.map(s => {
      s.value = '';
      if (s.valid) {
        s.valid = false;
      }
    });
  }

  updateDateSection(newDate: Date, addDivider = false) {
    this.sections.map(s => {
      if (s.role === TokenRole.day) {
        s.value = newDate
          .getDate()
          .toString()
          .padStart(s.leadingZero ? 2 : 1, '0');
      } else if (s.role === TokenRole.month) {
        s.value = (newDate.getMonth() + 1)
          .toString()
          .padStart(s.leadingZero ? 2 : 1, '0');
      } else if (s.role === TokenRole.year) {
        s.value = newDate.getFullYear().toString();
      }
      if (addDivider && s.role === TokenRole.divider) {
        s.value = s.pattern;
      }
    });
  }

  getSection(value: string, index: number, back: boolean) {
    const section = this.sections[index];

    const last = index === this.sections.length - 1;

    const actualLength =
      section.pattern.length + (section.leadingZero === false ? 1 : 0);
    let extra = value.slice(actualLength);

    const actual = (extra && value.slice(0, actualLength)) || value;

    if (section.role === TokenRole.divider) {
      if (back && !extra) {
        section.value = '';
        this.sections[index + 1].value = '';
      } else {
        section.value = section.pattern;
      }
      if (!section.pattern.startsWith(actual)) {
        if (!isNaN(+actual)) {
          extra = actual + extra;
        }
      } else if (index !== 0) {
        const prevSection = this.sections[index - 1];
        if (
          prevSection.leadingZero &&
          prevSection.value.length !== prevSection.pattern.length
        ) {
          if (+prevSection.value < prevSection.min) {
            prevSection.value = prevSection.min.toString();
          }
          prevSection.value = prevSection.value.padStart(2, '0');
        }
      }
    } else {
      const { value: number, extra: numberExtra } = this.parseNumber(actual);
      extra = numberExtra + extra;
      if (number) {
        if (section.min > number && actualLength === number.length) {
          section.value = section.min.toString();
        } else if (section.max < number) {
          section.value = section.max.toString();
          if (!last && !extra) {
            extra = this.sections[index + 1].pattern[0];
          }
        } else {
          section.value = number;
          if (extra && +section.value < section.min) {
            section.value = section.min.toString();
          }
        }
        section.valid =
          actualLength === section.value.length ||
          (section.leadingZero === false &&
            section.value.length === actualLength - 1);
      } else {
        if (extra !== this.sections[index + 1]?.pattern[0]) {
          extra = '';
        }
      }
    }

    if (
      section.valid &&
      section.value.length === actualLength &&
      section.leadingZero === false
    ) {
      section.value = section.value.replace(/^0/, '');
      if (!last && !extra) {
        extra = this.sections[index + 1].pattern[0];
      }
    }

    if (extra && !last) {
      this.getSection(extra, index + 1, back);
    }
  }

  parseNumber(value: string, extra = '') {
    if (Number.isNaN(+value.replace('.', 'x'))) {
      return this.parseNumber(value.slice(0, -1), extra + value.slice(-1));
    } else {
      return { value, extra };
    }
  }

  buildString() {
    return this.sections.map(s => s.value).join('');
  }

  parseValue(value: string) {
    let x = 0;
    while (value && x < 100) {
      x++;
    }
  }

  resetInput() {
    this.onInput('');
  }

  openCalendar(show = true) {
    this.showCalendar = show;
    this.cd.markForCheck();
  }

  calendarEvent(date: Date) {
    this.setDate(date);
    this.showCalendar = false;
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

const parseString = (str: string, tokens: TokenConfig) => {
  const tks: Token[] = [];

  let pos = 0;
  while (str) {
    const [name, token] = Object.entries(tokens).find(([key]) =>
      str.startsWith(key),
    ) || ['', {} as TokenConfig];

    if (name) {
      const length = name.length;
      tks.push({
        ...token,
        pattern: name,
        valid: false,
      } as Token);
      pos = pos + length;
      str = str.slice(length);
    } else {
      const lastTkn = tks[tks.length - 1];

      if (lastTkn.role === TokenRole.divider) {
        const length = str[0].length;
        tks[tks.length - 1] = {
          ...lastTkn,
          pattern: lastTkn.pattern + str[0],
        };
        pos = pos + length;
      } else {
        const length = str[0].length;
        tks.push({
          role: TokenRole.divider,
          pattern: str[0],
        });
        pos = pos + length;
      }
      str = str.slice(1);
    }
  }

  tks.reduce((prev, curr) => {
    const result = !!curr.role !== !!prev;
    if (!result)
      throw new Error(
        'Datepicker pattern must combine numbers and dividers and not start by divider!',
      );
    return curr.role;
  }, 0);

  return tks;
};
