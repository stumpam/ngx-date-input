import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  UntypedFormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subject } from 'rxjs';

import {
  isDateAfter,
  isDateBefore,
  normalizeDate,
} from '../../functions/date.functions';
import { padStart } from '../../functions/format.functions';
import {
  DateInputOptions,
  Token,
  TokenConfig,
  TokenRole,
} from '../../interfaces/date-input.interface';
import { CalendarModule } from '../calendar/calendar.component';
import { PositionDirective } from './position.directive';

@Component({
  selector: 'ngx-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  host: {
    class: 'ngx-date-input',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
  ],
})
export class DateInputComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  private init = true;

  @ViewChild('field', { static: true }) field!: ElementRef<HTMLInputElement>;
  @Input() attributes: Record<string, string> = {};
  @Input() set options(options: DateInputOptions | null) {
    if (!options) return;

    this.openCalendar(false);
    let update = false;

    if (
      this._options.format !== options.format ||
      this._options.min !== options.min ||
      this._options.max !== options.max
    ) {
      update = true;
    }

    this._options = {
      ...this._options,
      ...options,
    };

    if (update && this._options.tokens) {
      this.sections = parseString(this._options.format, this._options.tokens);
      if (this.date) {
        this.checkMinMax(true, true, true);
        const value = this.buildString();
        this.onInput(value);
      } else {
        this.onInput('');
      }
    }

    if (this.init && !update && this._options.tokens) {
      this.sections = parseString(this._options.format, this._options.tokens);
      this.init = false;
    }
  }

  @Output() blurred = new EventEmitter();

  _options: DateInputOptions = {
    hideTopbarToday: true,
    showBottomBar: true,
    bottomBar: {
      today: true,
      close: true,
    },
    showInputClear: false,
    iso: false,
    format: 'D. M. YYYY',
    tokens: {
      YYYY: {
        min: 1900,
        max: 2100,
        role: TokenRole.year,
      },
      DD: {
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
      D: {
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
    },
  };

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
  touchedFn: any = () => {};
  changeFn: any = () => {};
  disabled = false;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit() {
    Object.entries(this.attributes).forEach(([attr, value]) => {
      this.renderer.setAttribute(
        this.field.nativeElement,
        attr,
        value.toString()
      );
    });
  }

  setDate(date: Date) {
    this.prevDate = date;
    this.updateDateSection(date, true);
    const value = this.buildString();
    this.onInput(value);
  }

  writeValue(obj: string | Date | null): void {
    if (obj instanceof Date) {
      return this.setDate(obj);
    }

    if (typeof obj === 'string') {
      return this.setDate(normalizeDate(new Date(obj)));
    }

    if (obj === null) {
      this.showCalendar = false;
      this.cd.markForCheck();
      return this.onInput('');
    }
  }

  updateView(string: string) {
    this.renderer.setProperty(this.field.nativeElement, 'value', string);
  }

  registerOnChange(fn: any): void {
    this.changeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.touchedFn = fn;
  }

  onBlur(): void {
    this.blurred.emit();
    this.touchedFn?.();
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cd.markForCheck();
  }

  onClick() {
    this.updateSection('none');
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.attributes?.readonly) {
      return;
    }

    if (event.key === 'Delete') {
      if (
        this.cursorPosition === 0 &&
        this.cursorPositionEnd === this.field.nativeElement.value.length
      ) {
        this._options.min
          ? this.setDate(new Date(this._options.min))
          : this.onInput('');

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
        this._options.min
          ? this.setDate(new Date(this._options.min))
          : this.onInput('');

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
    if (!this.date || typeof this.cursorPosition !== 'number') return;

    let pos = this.cursorPosition;
    let right = pos;
    let index = 0;
    let active = true;

    const value = this.sections.reduce((str, section) => {
      if (!section.value) return str;

      let sectionValue = section.value;

      if (active && pos >= index && pos <= section.value.length + index) {
        if (section.role !== TokenRole.divider) {
          if (key !== 'none') {
            const orig = +section.value;
            let num = key === 'ArrowUp' ? orig + 1 : orig - 1;

            if (num > (section.max || 0)) num--;
            if (num < (section.min || 0)) num++;

            sectionValue = padStart(num, section.leadingZero ? 2 : 1);
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

  onInput(value: string | Date): void {
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
        if (!curr.valid || curr.value === undefined) return prev;
        if (curr.role === TokenRole.day) prev.day = curr.value;
        if (curr.role === TokenRole.month) prev.month = curr.value;
        if (curr.role === TokenRole.year) prev.year = curr.value;
        return prev;
      },
      { day: '', month: '', year: '' }
    );

    let checkedDay = day;
    if (year && month && day) {
      const date = new Date(+year, +month, 0).getDate();
      if (+day > date) {
        const section = this.sections.find((s) => s.role === TokenRole.day);

        if (section) {
          section.value = date.toString();
          checkedDay = section.value;
        }
      }
    }

    if (year && month && checkedDay) {
      this.prevDate = this.date;
      const leadingZeroMonth = padStart(month);
      const leadingZeroDay = padStart(checkedDay);
      this.date = new Date(`${year}-${leadingZeroMonth}-${leadingZeroDay}`);
    } else {
      this.prevDate = this.date;
      this.date = undefined;
    }

    this.checkMinMax();

    value = this.buildString();
    this.updateValue(value);
  }

  checkMinMax(addDivider = false, valid = false, update = false) {
    if (
      this._options.min &&
      this.date &&
      new Date(this._options.min) > this.date &&
      !this._options.showErrorOnInvalidDate
    ) {
      this.updateDateSection(new Date(this._options.min), addDivider, valid);
      update = false;
    }

    if (
      this._options.max &&
      this.date &&
      new Date(this._options.max) < this.date &&
      !this._options.showErrorOnInvalidDate
    ) {
      this.updateDateSection(new Date(this._options.max), addDivider, valid);
      update = false;
    }

    if (this.date && this._options.disableWeekends) {
      if (this.date.getDay() === 6) {
        this.date.setDate(this.date.getDate() - 1);
        this.updateDateSection(this.date, addDivider, valid);
        update = false;
      }

      if (this.date.getDay() === 0) {
        this.date.setDate(this.date.getDate() + 1);
        this.updateDateSection(this.date, addDivider, valid);
        update = false;
      }
    }

    if (update && this.date) {
      this.updateDateSection(this.date, true, true);
    }
  }

  updateValue(value: string) {
    this.updateView(value);
    if (this.date !== this.prevDate) {
      this.date?.setHours((-1 * this.date.getTimezoneOffset()) / 60, 0, 0, 0);
      this.changeFn?.(
        (this.date && (this._options.iso ? dateToISO(this.date) : this.date)) ||
          null
      );
    }

    this.prevValue = value;
  }

  resetSections() {
    this.sections.map((s) => {
      s.value = '';
      if (s.valid) {
        s.valid = false;
      }
    });
  }

  updateDateSection(newDate: Date, addDivider = false, valid = true): void {
    this.sections.map((s) => {
      if (s.role === TokenRole.day) {
        s.value = padStart(newDate.getDate(), s.leadingZero ? 2 : 1);
      } else if (s.role === TokenRole.month) {
        s.value = padStart(newDate.getMonth() + 1, s.leadingZero ? 2 : 1, '0');
      } else if (s.role === TokenRole.year) {
        s.value = newDate.getFullYear().toString();
      }

      if (valid && s.role !== TokenRole.divider) {
        s.valid = true;
      }

      if (addDivider && s.role === TokenRole.divider) {
        s.value = s.pattern;
      }
    });

    this.date = newDate;
  }

  getSection(value: string, index: number, back: boolean): void {
    const section = this.sections[index];

    if (!section.pattern) return;

    const last = index === this.sections.length - 1;

    const actualLength =
      section.pattern.length + (section.leadingZero === false ? 1 : 0);
    let extra = value.slice(actualLength);

    const actual = (extra && value.slice(0, actualLength)) || value;

    if (section.role === TokenRole.divider) {
      if (back && !extra) {
        section.value = '';
        this.sections[index + 1].value = '';
        this.sections[index + 1].valid = false;
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
          prevSection.value?.length !== prevSection.pattern?.length &&
          prevSection.value &&
          prevSection.min !== undefined
        ) {
          if (+prevSection.value < prevSection?.min) {
            prevSection.value = prevSection.min.toString();
          }
          prevSection.value = padStart(prevSection.value, 2);
        }
      }
    } else {
      const { value: number, extra: numberExtra } = this.parseNumber(actual);
      extra = numberExtra + extra;
      if (number && section.min !== undefined && section.max !== undefined) {
        if (section.min > +number && actualLength === number.length) {
          section.value = padStart(section.min, section.leadingZero ? 2 : 1);
        } else if (section.max < +number) {
          section.value = section.max.toString();
          if (!last && !extra && this.sections[index + 1].pattern) {
            extra = this.sections[index + 1].pattern![0];
          }
        } else {
          section.value = number;
          if (extra && +section.value < section.min) {
            section.value = padStart(section.min, section.leadingZero ? 2 : 1);
          }
          if (back && !last && section.valid) {
            this.sections[index + 1].value = '';
          }
        }
        section.valid =
          actualLength === section.value.length ||
          (section.leadingZero === false &&
            section.value.length === actualLength - 1);
      } else {
        if (
          (this.sections[index + 1]?.pattern &&
            extra !== this.sections[index + 1]?.pattern![0]) ||
          (!back && Number.isNaN(+extra[0]) && !section.valid)
        ) {
          extra = '';
        }
      }
    }

    if (
      section.valid &&
      section.value?.length === actualLength &&
      section.leadingZero === false
    ) {
      section.value = section.value.replace(/^0/, '');
      if (!last && !extra && this.sections[index + 1].pattern) {
        extra = this.sections[index + 1].pattern![0];
      }
    }

    if (extra && !last) {
      this.getSection(extra, index + 1, back);
    }
  }

  parseNumber(value: string, extra = ''): { value: string; extra: string } {
    if (Number.isNaN(+value.replace('.', 'x'))) {
      return this.parseNumber(value.slice(0, -1), extra + value.slice(-1));
    } else {
      return { value, extra };
    }
  }

  buildString(): string {
    return this.sections.map((s) => s.value).join('');
  }

  resetInput(closeCalendar = false): void {
    if (closeCalendar) {
      this.openCalendar(false);
    }
    this.onInput('');
  }

  openCalendar(show = true): void {
    this.showCalendar = show;
    this.cd.markForCheck();
  }

  calendarEvent(date: Date): void {
    this.setDate(date);
    this.showCalendar = false;
    this.cd.markForCheck();
  }

  validate({ value }: UntypedFormControl) {
    if (!value || !this._options.showErrorOnInvalidDate) return null;

    const minValidation =
      this._options.min &&
      isDateBefore(new Date(value), new Date(this._options.min));
    const maxValidation =
      this._options.max &&
      isDateAfter(new Date(value), new Date(this._options.max));

    const disabledValidation = this._options.disabledFn?.(
      new Date(value),
      'date'
    );

    return {
      ...(minValidation && {
        dateInputMin: true,
      }),
      ...(disabledValidation && { disabledValidation: true }),
      ...(maxValidation && {
        dateInputMax: true,
      }),
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

const parseString = (str: string, tokens: TokenConfig): Token[] => {
  const tks: Token[] = [];

  let pos = 0;
  while (str) {
    const [name, token] = Object.entries(tokens).find(([key]) =>
      str.startsWith(key)
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
        'Datepicker pattern must combine numbers and dividers and not start by divider!'
      );
    return curr.role;
  }, 0);

  return tks;
};

const dateToISO = (date: Date): string => {
  const month = (date.getMonth() + 1).toString();
  return `${date.getFullYear()}-${
    month.length === 1 ? '0' + month : month
  }-${padStart(date.getDate(), 2)}`;
};

@NgModule({
  imports: [CalendarModule, CommonModule],
  exports: [DateInputComponent],
  declarations: [DateInputComponent, PositionDirective],
})
export class NgxDateInputModule {}
