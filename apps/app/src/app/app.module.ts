import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormlyModule } from '@ngx-formly/core';
import { NgxDateInputModule } from '@stumpam/ngx-date-input';

import { AppComponent } from './app.component';
import { FormlyComponent } from './formly/formly.component';

@NgModule({
  declarations: [AppComponent, FormlyComponent],
  imports: [
    BrowserModule,
    NgxDateInputModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      types: [{ name: 'date', component: FormlyComponent }],
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
