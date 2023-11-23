import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { UserDetailsService } from 'src/app/core/services/user/user-details.service';

export const unauthGuard: CanActivateFn = () => {
  const userDetailsService = inject(UserDetailsService);
  return userDetailsService.loggedIn$.pipe(
    map((loggedIn) => {
      if (!loggedIn) {
        return true;
      } else {
        return false;
      }
    }),
  );
};
