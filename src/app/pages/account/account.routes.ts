import { Route } from '@angular/router';

export const ACCOUNT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./account.component').then(
        (component) => component.AccountComponent,
      ),
  },
  {
    path: 'games',
    loadComponent: () =>
      import('./games/games.component').then(
        (component) => component.GamesComponent,
      ),
  },
];
