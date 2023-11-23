import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';
import { QuestionService } from 'src/app/pages/pool/question.service';

export const poolGuard: CanActivateFn = (route, _state) => {
  const activePoolService = inject(ActivePoolService);
  const questionService = inject(QuestionService);
  const router = inject(Router);
  const gameId = route.paramMap.get('gameId');
  if (gameId === null) {
    throw new Error(`Url param gameId is null`);
  }
  return activePoolService.setupSinglePoolData(gameId).pipe(
    tap((data) => {
      if (!data) {
        router.navigateByUrl('page-not-found', { skipLocationChange: true }); // TODO change to pool closed page
      } else {
        questionService.setCurrentPool(data.poolDetails);
      }
    }),
    map((data) => data !== undefined),
  );
};
