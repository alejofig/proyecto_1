import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAuth0({
      domain: 'dev-s8qwnnguwcupqg2o.us.auth0.com',
      clientId: 'cbzY5myYY3OdJpyDGtn9NXhKQXhVDyaJ',
      authorizationParams: {
        redirect_uri: "https://app.uniandes-sports.com/panel"
      }
    }),
  provideHttpClient(),
  provideClientHydration()]
};
