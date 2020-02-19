import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import {
  CalendarView,
  DateInputOptions,
} from '../../interfaces/date-input.interface';

@Component({
  selector: 'ngx-date-input-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.ngx-date-input-calendar]': 'true',
    '(document:click)': 'hide($event.target)',
  },
})
export class CalendarComponent implements OnInit {
  @Input() date: Date | null;

  @Input() options: DateInputOptions = {} as DateInputOptions;

  @Output() selectionChange = new EventEmitter();
  @Output() hideCalendar = new EventEmitter();

  today = new Date();
  dates: Date[][] = [];
  activeMonth = new Date();
  skipVisibility = true;

  months: string[] = [
    'leden',
    'únor',
    'březen',
    'duben',
    'květen',
    'červen',
    'červenec',
    'srpen',
    'září',
    'říjen',
    'listopad',
    'prosinec',
  ];

  days: string[] = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

  view: CalendarView = 'month';

  constructor(private readonly cd: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.options.min) {
      const min = new Date(this.options.min);
      min.setHours(0, 0, 0, 0);
      if (this.date.getTime() < min.getTime()) {
        this.date = min;
      }
    }
    if (this.options.max) {
      const max = new Date(this.options.max);
      max.setHours(0, 0, 0, 0);
      if (this.date.getTime() > max.getTime()) {
        this.date = max;
      }
    }
    this.activeMonth = this.date ? new Date(this.date) : new Date();
    this.today.setHours(0, 0, 0, 0);
    this.date?.setHours(0, 0, 0, 0);
    this.generateMonth(this.date ? this.date : this.activeMonth);
    if (this.options.months) {
      this.months = this.options.months;
    }
    if (this.options.days) {
      this.days = this.options.days;
    }
  }

  generateMonth(date: Date) {
    this.dates = [];
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    firstDay.setHours(0, 0, 0, 0);
    const year = firstDay.getFullYear();
    const month = firstDay.getMonth();
    let day = -1 * (firstDay.getDay() || 7) + 2;

    let weekCount = 6;
    for (; weekCount > 0; weekCount--) {
      const activeWeek: Date[] = [];
      let dayCount = 7;

      const lastDayInWeek5 = normalizeDate(this.dates?.[4]?.[6].toUTCString());
      lastDayInWeek5?.setDate(lastDayInWeek5.getDate() + 1);

      if (lastDayInWeek5 && lastDayInWeek5.getMonth() !== month) {
        break;
      }

      for (; dayCount > 0; dayCount--) {
        const activeDay = new Date(year, month, day);
        activeDay.setHours(0, 0, 0, 0);
        activeWeek.push(activeDay);
        day++;
      }

      this.dates.push(activeWeek);
    }
  }

  getClass(date: Date) {
    const notActiveMonth = this.isNotActiveMonth(date);
    const today = date.getTime() === this.today.getTime() ? 'today' : '';
    const selected = date.getTime() === this.date?.getTime() ? 'selected' : '';

    return `${today} ${selected} ${notActiveMonth}`;
  }

  isNotActiveMonth(date: Date) {
    return date.getMonth() === this.activeMonth.getMonth() ? '' : 'disabled';
  }

  changeMonth(next = true) {
    const nextMonth = next ? 1 : -1;
    this.activeMonth.setMonth(this.activeMonth.getMonth() + nextMonth);
    this.generateMonth(this.activeMonth);
    this.cd.markForCheck();
  }

  changeYear(next = true) {
    const nextYear = next ? 1 : -1;
    this.activeMonth.setFullYear(this.activeMonth.getFullYear() + nextYear);
    this.cd.markForCheck();
  }

  changeDecade(next = true) {
    const nextYear = next ? 7 : -7;
    this.activeMonth.setFullYear(this.activeMonth.getFullYear() + nextYear);
    this.cd.markForCheck();
  }

  toToday() {
    this.activeMonth = new Date(this.today);
    this.generateMonth(this.today);
    this.toggleView('month');
  }

  setDate(date: Date) {
    if (this.notActive(date)) {
      return;
    }

    if (this.isNotActiveMonth(date)) {
      this.activeMonth = date;
    }
    this.selectionChange.emit(date);
  }

  setMonth(month: number) {
    if (this.notActiveMonth(month)) {
      return;
    }

    this.activeMonth.setMonth(month);
    this.generateMonth(this.activeMonth);
    this.toggleView('month');
  }

  setYear(year: number) {
    if (this.notActiveYear(year)) {
      return;
    }

    this.activeMonth.setFullYear(year);
    this.toggleView('year');
  }

  toggleView(view: CalendarView) {
    this.view = view;
    this.cd.markForCheck();
  }

  hide(target: HTMLElement) {
    if (this.skipVisibility) {
      this.skipVisibility = false;

      return;
    }

    if (
      !target.classList.contains('ngx-dic') &&
      !target.classList.contains('ngx-date-input-calendar')
    ) {
      this.hideCalendar.emit();
    }
  }

  showMonth(next = true) {
    if (next && this.options.max) {
      const max = normalizeDate(this.options.max);
      const active = new Date(
        this.activeMonth.getFullYear(),
        this.activeMonth.getMonth() + 1,
        1,
      );
      active.setHours(0, 0, 0, 0);
      if (active.getTime() > max.getTime()) {
        return false;
      }
    }
    if (!next && this.options.min) {
      const min = normalizeDate(this.options.min);

      const active = new Date(
        this.activeMonth.getFullYear(),
        this.activeMonth.getMonth(),
        0,
      );
      active.setHours(0, 0, 0, 0);
      if (active.getTime() < min.getTime()) {
        return false;
      }
    }
    return true;
  }

  showYear(next = true) {
    if (next && this.options.max) {
      const max = normalizeDate(this.options.max);
      const active = normalizeDate(
        new Date(this.activeMonth.getFullYear() + 1, 0, 1),
      );
      if (active.getTime() > max.getTime()) {
        return false;
      }
    }
    if (!next && this.options.min) {
      const min = normalizeDate(this.options.min);

      const active = normalizeDate(
        new Date(this.activeMonth.getFullYear(), 0, 0),
      );
      if (active.getTime() < min.getTime()) {
        return false;
      }
    }
    return true;
  }

  notActive(date: Date) {
    if (this.options.disableWeekends) {
      const weekDay = date.getDay();
      if (weekDay === 6 || weekDay === 0) {
        return true;
      }
    }

    if (this.options.min) {
      const min = normalizeDate(this.options.min);
      if (date.getTime() < min.getTime()) {
        return true;
      }
    }
    if (this.options.max) {
      const max = normalizeDate(new Date(this.options.max));
      if (date.getTime() > max.getTime()) {
        return true;
      }
    }
    return false;
  }

  notActiveMonth(month: number) {
    if (this.options.min) {
      const min = normalizeDate(this.options.min);
      if (month < min.getMonth()) {
        return true;
      }
    }

    if (this.options.max) {
      const max = normalizeDate(this.options.max);
      if (month > max.getMonth()) {
        return true;
      }
    }
  }

  notActiveYear(year: number) {
    if (this.options.min) {
      const min = normalizeDate(this.options.min);
      if (year < min.getFullYear()) {
        return true;
      }
    }

    if (this.options.max) {
      const max = normalizeDate(this.options.max);
      if (year > max.getFullYear()) {
        return true;
      }
    }
  }

  showToday() {
    if (this.options.min) {
      const min = normalizeDate(this.options.min);
      if (this.today.getTime() < min.getTime()) {
        return false;
      }
    }
    if (this.options.max) {
      const max = normalizeDate(this.options.max);
      if (this.today.getTime() > max.getTime()) {
        return false;
      }
    }
    return true;
  }

  fadeDate(date: Date) {
    return this.activeMonth.getMonth() !== date.getMonth();
  }

  showDate(date: Date) {
    return this.options.hideOtherMonths &&
      this.activeMonth.getMonth() !== date.getMonth()
      ? ''
      : date.getDate();
  }
}

const normalizeDate = (date: string | Date) => {
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
