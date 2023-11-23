import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { AuthenticatorRedirectService } from 'src/app/core/services/system/authenticator-redirect.service';
import { UserDetailsService } from 'src/app/core/services/user/user-details.service';

export const authGuard: CanActivateFn = () => {
  const userDetailsService = inject(UserDetailsService);
  const authenticatorRedirectService = inject(AuthenticatorRedirectService);
  return userDetailsService.loggedIn$.pipe(
    map((loggedIn) => {
      if (loggedIn) {
        return true;
      } else {
        authenticatorRedirectService.redirectToLogin();
        return false;
      }
    }),
  );
};
