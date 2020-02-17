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

  options1: DateInputOptions = { format: 'd. M. yyyy' };
  options2: DateInputOptions = { format: 'yyyy-MM-dd' };
  options3: DateInputOptions = {
    format: 'yyyy-MM-dd',
    min: '2020-01-01',
    max: '2020-12-31',
  };
  options4: DateInputOptions = {
    format: 'd. M. yyyy',
    min: '2020-03-10',
    max: '2020-04-10',
    iso: true,
    disableWeekends: true,
    hideOtherMonths: true,
  };

  ngOnInit() {
    this.ctrl.valueChanges.subscribe(val => console.log(`appCmp: ${val}`));
  }
}
