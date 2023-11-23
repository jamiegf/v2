import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ActivationEnd,
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  Params,
  Router,
} from '@angular/router';
import { Subscription, bufferToggle, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterHistoryService {
  private sub: Subscription | undefined;

  private routerHistory: RouterHistoryItem[] = [];

  constructor(private router: Router) {}

  private routeStart$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationStart),
  );

  private routeEnd$ = this.router.events.pipe(
    filter(
      (event) =>
        event instanceof NavigationEnd || event instanceof NavigationCancel,
    ),
  );

  private events$ = this.router.events.pipe(
    bufferToggle(this.routeStart$, () => this.routeEnd$),
  );

  private pathFromRoot$ = this.events$.pipe(
    filter((events) => events.at(-1) instanceof NavigationEnd),
    map((events): ActivatedRouteSnapshot[] | undefined => {
      return events.find(
        (event): event is ActivationEnd => event instanceof ActivationEnd,
      )?.snapshot.pathFromRoot;
    }),
    filter((path): path is ActivatedRouteSnapshot[] => path !== undefined),
  );

  private addItemToRouterHistory(
    pathFromRoot: ActivatedRouteSnapshot[],
    routerHistory: RouterHistoryItem[],
  ): RouterHistoryItem[] {
    const historyItem = this.createRouterHistoryItem(pathFromRoot);
    const lastItemIndex = routerHistory.length - 1;
    if (routerHistory.length === 0) {
      routerHistory.push(historyItem);
    } else if (routerHistory[lastItemIndex].route[0] === historyItem.route[0]) {
      routerHistory[lastItemIndex] = historyItem;
    } else {
      routerHistory.push(historyItem);
    }
    return routerHistory;
  }

  private createRouterHistoryItem(
    pathFromRoot: ActivatedRouteSnapshot[],
  ): RouterHistoryItem {
    const route = pathFromRoot.flatMap((route) =>
      route.url.map((urlSegment) => urlSegment.path),
    );
    return {
      queryParams: pathFromRoot.at(-1)?.queryParams || {},
      route,
    };
  }

  public startHistoryTracking(): void {
    this.sub = this.pathFromRoot$.subscribe((pathFromRoot) => {
      this.routerHistory = this.addItemToRouterHistory(
        pathFromRoot,
        this.routerHistory,
      );
    });
  }

  public stopHistoryTracking(): void {
    this.sub?.unsubscribe();
  }

  /**
   * traverse backwards through router history
   * @param defaultRoute route to go to if no history
   * @param replaceState whether to replace the current state in browser history, default false
   * // TODO this can cause a memory leak under extreme circumstances + potentially weird navigation
   * need to implement some sort of ordered set list to resolve this but its probably not worth it right now
   */
  public back(defaultRoute: RouterHistoryItem, replaceState = false): void {
    this.routerHistory.pop();
    const historyItem = this.routerHistory.at(-1) || defaultRoute;
    this.router.navigate(historyItem.route, {
      queryParams: historyItem.queryParams,
      replaceUrl: replaceState,
    });
  }
}

interface RouterHistoryItem {
  route: string[];
  queryParams?: Params;
}
