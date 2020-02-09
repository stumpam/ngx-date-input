import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';

export const DATE_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateInputComponent),
  multi: true,
};

const tokens = {
  yyyy: {
    min: 1900,
    max: 2100,
  },
  dd: {
    min: 1,
    max: 31,
    leadingZero: true,
  },
  MM: {
    min: 1,
    max: 12,
    leadingZero: true,
  },
  d: {
    min: 1,
    max: 31,
    leadingZero: false,
  },
  M: {
    min: 1,
    max: 12,
    leadingZero: false,
  },
};

const parseString = (str: string) => {
  const tks = [];

  let pos = 0;
  while (str) {
    const [name, token] = Object.entries(tokens).find(([key]) =>
      str.startsWith(key),
    ) || ['', {}];

    if (name) {
      const length = name.length;
      tks.push({
        ...token,
        type: 'pattern',
        start: pos,
        end: pos + length - 1,
      });
      pos = pos + length;
      str = str.slice(length);
    } else {
      const lastTkn = tks[tks.length - 1];

      if (lastTkn.type === 'divider') {
        const length = str[0].length;
        tks[tks.length - 1] = {
          ...lastTkn,
          value: lastTkn.value + str[0],
          end: lastTkn.end + length,
        };
        pos = pos + length;
      } else {
        const length = str[0].length;
        tks.push({
          type: 'divider',
          value: str[0],
          start: pos,
          end: pos + length - 1,
        });
        pos = pos + length;
      }
      str = str.slice(1);
    }
  }

  return tks;
};

@Component({
  selector: 'ngx-date-input',
  template: '<input #field>',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '(click)': 'onClick()',
    '[attr.disabled]': 'disabled',
    '(input)': 'onInput($event.target.value)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DATE_INPUT_VALUE_ACCESSOR],
})
export class DateInputComponent
  implements ControlValueAccessor, OnDestroy, AfterViewInit {
  @ViewChild('field', { static: true }) field: ElementRef<HTMLInputElement>;

  @Input() set format(format: string) {
    console.log(parseString(format));
  }

  tokens = [];

  private readonly destroy$ = new Subject<void>();
  touchedFn: any = null;
  changeFn: any = null;
  disabled = false;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private renderer: Renderer2,
  ) {}

  writeValue(obj: any): void {
    this.renderer.setProperty(this.field.nativeElement, 'value', obj);
  }

  ngAfterViewInit() {
    console.log(this.field);
  }

  registerOnChange(fn: any): void {
    this.changeFn = fn;
    console.log(fn);
  }

  registerOnTouched(fn: any): void {
    this.touchedFn = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cd.markForCheck();
  }

  onClick() {
    this.touchedFn?.();
  }

  onInput(value: string) {
    console.dir(value);
    this.changeFn?.(value);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
