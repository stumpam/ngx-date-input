import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CalendarComponent } from './components/calendar/calendar.component';
import { DateInputComponent } from './components/date-input/date-input.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DateInputComponent, CalendarComponent],
  exports: [DateInputComponent],
})
export class NgxDateInputModule {}
