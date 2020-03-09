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
    view: 'year',
  };
  options2: DateInputOptions = {
    format: 'YYYY-MM-DD',
    max: '2000-12-31',
    image: '*',
    view: 'decade',
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
    this.ctrl.valueChanges.subscribe(val => console.log(`appCmp: ${val}`));
    this.form.valueChanges.subscribe(val => console.log('formly: ', val));
  }
}
