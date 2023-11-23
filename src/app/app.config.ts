import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
} from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { tap } from 'rxjs';
import { RouterHistoryService } from 'src/app/core/services/system/router-history.service';
import { UserDetailsService } from 'src/app/core/services/user/user-details.service';
import { Logger } from 'src/app/lib/logger';
import { environment } from 'src/environments/environment';
import { routes } from './app.routes';

function initializeAppFactory(
  historyService: RouterHistoryService,
  userDetailsService: UserDetailsService,
) {
  return () => {
    const logger = Logger.getLogger();
    logger.init({ production: environment.production });
    historyService.startHistoryTracking();
    return userDetailsService
      .initialise()
      .pipe(tap(() => logger.debug(['initialisation complete'])));
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [RouterHistoryService, UserDetailsService],
      multi: true,
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'GBP',
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    {
      provide: LOCALE_ID,
      useValue: 'en-GB',
    },
    provideAnimations(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
};
