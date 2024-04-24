import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {AuthHttpInterceptor, provideAuth0} from '@auth0/auth0-angular';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient} from '@angular/common/http';
import {provideClientHydration} from '@angular/platform-browser';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

export const provideTranslation = () => ({
  defaultLanguage: 'es',
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
  },
});

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAuth0({
      domain: 'dev-s8qwnnguwcupqg2o.us.auth0.com',
      clientId: 'cbzY5myYY3OdJpyDGtn9NXhKQXhVDyaJ',
      authorizationParams: {
        redirect_uri: "https://app.uniandes-sports.com/panel",
        //redirect_uri: "http://localhost:4200/panel",
        audience: 'https://dev-s8qwnnguwcupqg2o.us.auth0.com/api/v2/'
      }
    }),
    provideHttpClient(),
    provideClientHydration(),
    importProvidersFrom([
      HttpClientModule,
      TranslateModule.forRoot(provideTranslation())
    ]),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    },

  ]
};
