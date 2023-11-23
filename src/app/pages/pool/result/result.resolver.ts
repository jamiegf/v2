import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import {
  EnterPoolResult,
  EnterPoolService,
} from 'src/app/pages/pool/enter-pool.service';

export const resultResolver: ResolveFn<undefined | EnterPoolResult[]> = async (
  route,
  _state,
) => {
  const router = inject(Router);
  const enterPoolService = inject(EnterPoolService);
  const results = await enterPoolService.enterPool();
  if (results === undefined) {
    router.navigate(createFailureRoute('qa', route));
  }
  return results;
};

// TODO PJ
function createFailureRoute(
  pageToNavigateTo: string,
  route: ActivatedRouteSnapshot,
): string[] {
  return [
    ...route.pathFromRoot
      .slice(0, -1)
      .flatMap((path) => path.url.map((segment) => segment.path)),
    pageToNavigateTo,
  ];
}
