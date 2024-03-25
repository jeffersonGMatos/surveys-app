import { ApplicationConfig, isDevMode, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './utils/http-interceptors/auth.interceptor';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localePt, "pt-br")

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }), 
    provideClientHydration(), 
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    {provide: LOCALE_ID, useValue: 'pt-br'}
  ]
    
};
