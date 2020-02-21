import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateInputOptions } from '@stumpam/ngx-date-input';

@Component({
  selector: 'ngx-date-input-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Ngx-Date-Input';

  ctrl = new FormControl(new Date());

  options1: DateInputOptions = { format: 'D. M. YYYY' };
  options2: DateInputOptions = { format: 'YYYY-MM-DD', image: '*' };
  options3: DateInputOptions = {
    format: 'YYYY-MM-DD',
    min: '2020-01-01',
    max: '2020-12-31',
    image: '*',
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

  ngOnInit() {
    this.ctrl.valueChanges.subscribe(val => console.log(`appCmp: ${val}`));
  }
}
