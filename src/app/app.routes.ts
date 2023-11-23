import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guard/auth.guard';
import { PageNotFoundComponent } from 'src/app/pages/page-not-found/page-not-found.component';
import { poolGuard } from 'src/app/pages/pool/pool.guard';
import { REGISTRATION_ROUTES } from 'src/app/pages/registration/registration.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(
        (component) => component.LandingComponent,
      ),
  },
  {
    path: 'lobby',
    loadChildren: () =>
      import('./pages/lobby/routes').then((mod) => mod.LOBBY_ROUTES),
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/account/account.routes').then(
        (mod) => mod.ACCOUNT_ROUTES,
      ),
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./pages/calendar/calendar.component').then(
        (component) => component.CalendarComponent,
      ),
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./pages/faq/faq.component').then(
        (component) => component.FaqComponent,
      ),
  },
  {
    path: 'pool/:gameId',
    canActivate: [poolGuard],
    loadComponent: () =>
      import('./pages/pool/pool.component').then(
        (component) => component.PoolComponent,
      ),
    loadChildren: () =>
      import('./pages/pool/pool.routes').then((mod) => mod.POOL_ROUTES),
  },
  {
    path: 'pool-closed',
    loadComponent: () =>
      import('./pages/pool-closed/pool-closed.component').then(
        (component) => component.PoolClosedComponent,
      ),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy.component').then(
        (component) => component.PrivacyPolicyComponent,
      ),
  },
  {
    path: 'pool-rules',
    loadComponent: () =>
      import('./pages/pool-rules/pool-rules.component').then(
        (component) => component.PoolRulesComponent,
      ),
  },
  {
    path: 'responsible-gaming',
    loadComponent: () =>
      import('./pages/responsible-gaming/responsible-gaming.component').then(
        (component) => component.ResponsibleGamingComponent,
      ),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./pages/terms/terms.component').then(
        (component) => component.TermsComponent,
      ),
  },
  REGISTRATION_ROUTES,
  {
    path: 'login',
    redirectTo: 'account',
  },
  {
    path: '404',
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
