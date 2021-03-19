import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DateInputOptions } from '@stumpam/ngx-date-input';

@Component({
  selector: 'ngx-date-input-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Ngx-Date-Input';

  ctrl = new FormControl(new Date());

  options1: DateInputOptions = {
    format: 'D. M. YYYY',
    min: '2020-01-10',
    minAtStart: true,
    view: 'decade',
    showInactiveArrows: true,
  };
  options2: DateInputOptions = {
    format: 'YYYY-MM-DD',
    max: '2000-12-31',
    image: '*',
    view: 'decade',
    showInputClear: true,
    maxAtEnd: true,
    disabledFn: (date, type): boolean => {
      if (type === 'year') {
        return date > 1950 && date < 1960;
      }

      if (type === 'date') {
        return (
          (date as Date).getFullYear() > 1950 &&
          (date as Date).getFullYear() < 1960
        );
      }
    },
  };
  options3: DateInputOptions = {
    format: 'YYYY-MM-DD',
    min: '2020-01-10',
    max: '2020-12-31',
    image: '*',
    disableOtherMonths: true,
  };
  options4: DateInputOptions = {
    format: 'D. M. YYYY',
    min: '2020-03-10',
    max: '2020-04-10',
    iso: true,
    disableWeekends: true,
    hideOtherMonths: true,
    image: '*',
    bottomBar: {
      today: true,
      clear: true,
      close: true,
    },
  };

  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'date',
      type: 'date',
      templateOptions: {
        label: 'Date',
        required: true,
        attributes: {
          inputmode: 'double',
        },
        dateOptions: { format: 'D. M. YYYY' },
      },
    },
  ];

  ngOnInit() {
    setTimeout(() => {
      this.options4.max = '2020-03-11';
      this.options4.format = 'YYYY-MM-DD';
      this.options4 = JSON.parse(JSON.stringify(this.options4));
    }, 2000);
    setTimeout(() => {
      this.options3.max = '2020-03-11';
      this.options3 = JSON.parse(JSON.stringify(this.options3));
    }, 3000);

    this.ctrl.valueChanges.subscribe(val => console.log(`appCmp: ${val}`));
    this.form.valueChanges.subscribe(val => console.log('formly: ', val));
  }
}
