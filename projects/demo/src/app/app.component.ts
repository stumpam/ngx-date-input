import { Component } from '@angular/core';
import { DateInputOptions } from 'ngx-date-input';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  model: Date | undefined;

  options: DateInputOptions = {
    iso: true,
    format: 'D. M. YYYY',
    view: 'decade',
    showInputClear: false,
    showErrorOnInvalidDate: true,
    maxAtEnd: true,
    min: '2023-01-01',
    max: '2023-06-30',
    image: 'd',
    disabledFn(date, type) {
      return (
        type === 'date' &&
        typeof date === 'object' &&
        date.getMonth() === 2 &&
        date.getDate() === 1
      );
    },
  };
}
