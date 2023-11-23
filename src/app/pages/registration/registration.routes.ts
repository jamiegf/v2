import { Route } from '@angular/router';
import { unauthGuard } from 'src/app/core/guard/unauth.guard';
import { DetailsComponent } from 'src/app/pages/registration/details/details.component';
import { registrationStageGuard } from 'src/app/pages/registration/registration-stage.guard';

export const REGISTRATION_ROUTES: Route = {
  path: 'registration',
  canActivate: [unauthGuard],
  canActivateChild: [registrationStageGuard],
  loadComponent: () =>
    import('./registration.component').then(
      (component) => component.RegistrationComponent,
    ),
  loadChildren: () => [
    {
      path: 'account',
      loadComponent: () =>
        import('./account/account.component').then(
          (component) => component.AccountComponent,
        ),
    },
    {
      path: 'address',
      loadComponent: () =>
        import('./address/address.component').then(
          (component) => component.AddressComponent,
        ),
    },
    {
      path: 'details',
      component: DetailsComponent,
    },
    {
      path: 'successful',
      loadComponent: () =>
        import('./successful/successful.component').then(
          (component) => component.SuccessfulComponent,
        ),
    },
    {
      path: 'unsuccessful',
      loadComponent: () =>
        import('./unsuccessful/unsuccessful.component').then(
          (component) => component.UnsuccessfulComponent,
        ),
    },
    {
      path: 'verify',
      loadComponent: () =>
        import('./verify/verify.component').then(
          (component) => component.VerifyComponent,
        ),
    },
    {
      path: '**',
      redirectTo: 'details',
    },
  ],
};
