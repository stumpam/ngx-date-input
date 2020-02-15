import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'ngx-date-input-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.ngx-date-input-calendar]': 'true',
  },
})
export class CalendarComponent implements OnInit {
  @Input() date: Date;

  @Output() selectionChange = new EventEmitter();

  today = new Date();
  dates: Date[][] = [];
  activeMonth = new Date();

  constructor() {}

  ngOnInit() {
    this.today.setHours(0, 0, 0, 0);
    this.date.setHours(0, 0, 0, 0);
    this.generateMonth(this.today);
  }

  generateMonth(date: Date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    firstDay.setHours(0, 0, 0, 0);
    const year = firstDay.getFullYear();
    const month = firstDay.getMonth();
    let day = -firstDay.getDay() + 2;

    let weekCount = 5;
    for (; weekCount > 0; weekCount--) {
      const activeWeek: Date[] = [];
      let dayCount = 7;
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
    const notActiveMonth =
      date.getMonth() === this.activeMonth.getMonth() ? '' : 'not-active';
    const today = date.getTime() === this.today.getTime() ? 'today' : '';
    const selected = date.getTime() === this.date.getTime() ? 'selected' : '';

    return `${today} ${selected} ${notActiveMonth}`;
  }

  emitDate(date: Date) {
    this.selectionChange.emit(date);
  }
}
