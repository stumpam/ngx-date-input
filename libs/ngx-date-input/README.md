# NgxDateInput

Angular Date picker with masked input.

Demo: [https://stackblitz.com/edit/ngx-date-input](https://stackblitz.com/edit/ngx-date-input)

## Quick Start

1. Import NgxDateInputModule to your project.

```typescript
import { NgxDateInputModule } from '@stumpam/ngx-date-input';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxDateInputModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

2. Use in HTML template

```typescript
<ngx-date-input [formControl]="ctrl" [options]="options"></ngx-date-input>
```

or with custom image (svg)

```typescript
<ngx-date-input [formControl]="ctrl" [options]="options1">
    <img src="*">
  </ngx-date-input>
```

3. Set up in parent component

```typescript
options4: DateInputOptions = {
  // valid date types D/DD, M/MM, YYYY and any dividers between
  format: 'D. M. YYYY',
  // minimal date in YYYY-MM-DD format
  min: '2020-03-10',
  // maximum date in YYYY-MM-DD format
  max: '2020-04-10',
  // bolean whether datepicker returns Date object or YYYY-MM-DD format
  iso: true,
  // Disables weekends fo pick fromcalendar
  disableWeekends: true,
  // Hides other month dates in calendar
  hideOtherMonths: true,
  // Path to image of calendar, when not set it will use ng-content
  image: '*',
};
```

### Works with [formly](https://formly.dev)

If you want to add attributes directly to input element make custom Formly field and initialize it on `ngOnInit`

```typescript
ngOnInit() {
    this.attributes = {
      id: this.id,
      ...this.to.attributes,
    };
  }
```

and use it in the template

```HTML
<ngx-date-input [formControl]="formControl" [options]="to.dateOptions" [attributes]="attributes"></ngx-date-input>
```

> ⚠ Caution
>
> Attributes are bound just once on ngOnIput hook. Changes are matter of future improvements.
