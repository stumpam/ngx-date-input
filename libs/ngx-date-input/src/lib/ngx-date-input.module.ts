import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CalendarComponent } from './components/calendar/calendar.component';
import { DateInputComponent } from './components/date-input/date-input.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [DateInputComponent, CalendarComponent],
  exports: [DateInputComponent],
})
export class NgxDateInputModule {}
