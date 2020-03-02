import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ngx-date-input-formly',
  templateUrl: './formly.component.html',
  styleUrls: ['./formly.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyComponent extends FieldType implements OnInit {
  attributes = {};

  ngOnInit() {
    this.attributes = {
      id: this.id,
      ...this.to.attributes,
    };
  }
}
