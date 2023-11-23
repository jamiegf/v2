import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import {
  RegistrationService,
  RegistrationStage,
} from 'src/app/pages/registration/registration.service';

export const registrationStageGuard: CanActivateFn = (route) => {
  const registrationService = inject(RegistrationService);
  const router = inject(Router);
  const path = route.url[0].path;
  return registrationService.stage$.pipe(
    map((stage) => {
      if (path === RegistrationStage[stage]) {
        return true;
      }

      if (
        path === 'details' ||
        stage === RegistrationStage.successful ||
        stage === RegistrationStage.unsuccessful
      ) {
        registrationService.reset();
      }

      return router.createUrlTree(['registration', RegistrationStage[stage]]);
    }),
  );
};
