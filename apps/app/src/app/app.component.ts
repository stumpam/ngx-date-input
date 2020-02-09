import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-date-input-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Ngx-Date-Input';

  ctrl = new FormControl();

  ngOnInit() {
    this.ctrl.valueChanges.subscribe(val => console.log(`appCmp: ${val}`));
  }
}
