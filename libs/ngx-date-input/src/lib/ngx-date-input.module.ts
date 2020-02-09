import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DateInputComponent } from './components/date-input/date-input.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [DateInputComponent],
  exports: [DateInputComponent],
})
export class NgxDateInputModule {}
