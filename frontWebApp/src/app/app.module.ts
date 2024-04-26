import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AuthModule.forRoot({
      domain: 'dev-s8qwnnguwcupqg2o.us.auth0.com',
      clientId: 'cbzY5myYY3OdJpyDGtn9NXhKQXhVDyaJ',
      audience: 'https://dev-s8qwnnguwcupqg2o.us.auth0.com/api/v2/',
      httpInterceptor: {
        allowedList: [
          {
            uri: 'http://127.0.0.1:3002/get_current_user/'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
