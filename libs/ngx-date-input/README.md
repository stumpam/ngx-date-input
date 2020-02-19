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
  // valid date types d/dd, M/MM, yyyy and any dividers between
  format: 'd. M. yyyy',
  // minimal date in YYYY-MM-dd format
  min: '2020-03-10',
  // maximum date in YYYY-MM-dd format
  max: '2020-04-10',
  // bolean whether datepicker returns Date object or YYYY-MM-dd format
  iso: true,
  // Disables weekends fo pick fromcalendar
  disableWeekends: true,
  // Hides other month dates in calendar
  hideOtherMonths: true,
  // Path to image of calendar, when not set it will use ng-content
  image: '*',
};
```
