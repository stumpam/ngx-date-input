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

      const lastDayInWeek5 = this.dates?.[4]?.[6].getMonth();
      if (lastDayInWeek5 && lastDayInWeek5 !== month) {
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

  toToday() {
    this.activeMonth = new Date(this.today);
    this.generateMonth(this.today);
    this.cd.markForCheck();
  }

  toggleView(view: CalendarView) {
    this.view = view;
    this.cd.markForCheck();
  }

  emitDate(date: Date) {
    if (this.isNotActiveMonth(date)) {
      this.activeMonth = date;
    }
    this.selectionChange.emit(date);
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
      const max = new Date(this.options.max);
      max.setHours(0, 0, 0, 0);
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
      const min = new Date(this.options.min);
      min.setHours(0, 0, 0, 0);

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
      const max = new Date(this.options.max);
      max.setHours(0, 0, 0, 0);
      if (date.getTime() > max.getTime()) {
        return true;
      }
    }
    return false;
  }

  showToday() {
    if (this.options.min) {
      const min = normalizeDate(this.options.min);
      
    }
    if (this.options.max) {
    }
    return true;
  }

  showDate(date: Date) {
    return this.options.hideOtherMonths &&
      this.activeMonth.getMonth() !== date.getMonth()
      ? ''
      : date.getDate();
  }
}

const normalizeDate = (date: string) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  return normalizedDate;
};
