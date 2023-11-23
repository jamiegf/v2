import { ActivatedRouteSnapshot } from '@angular/router';

export function getPathFromRootAsArray(
  route: ActivatedRouteSnapshot,
): string[] {
  return route.pathFromRoot
    .slice(0, -1)
    .flatMap((path) => path.url.map((segment) => segment.path));
}
