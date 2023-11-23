import { Route } from '@angular/router';
import { filterPoolsGuard } from 'src/app/pages/lobby/filter-pools.guard';
import { LobbyComponent } from 'src/app/pages/lobby/lobby.component';

export const LOBBY_ROUTES: Route[] = [
  {
    path: '',
    canActivate: [filterPoolsGuard],
    component: LobbyComponent,
  },
  {
    path: ':category',
    canActivate: [filterPoolsGuard],
    component: LobbyComponent,
  },
];
