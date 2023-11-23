import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { combineLatest, map, tap } from 'rxjs';
import { getPathFromRootAsArray } from 'src/app/lib/get-path-from-root-as-array';
import { DoubleUpService } from 'src/app/pages/pool/double-up.service';
import { QuestionService } from 'src/app/pages/pool/question.service';

export const paymentGuard: CanActivateFn = (route, _state) => {
  const questionService = inject(QuestionService);
  const doubleUpService = inject(DoubleUpService);
  const router = inject(Router);
  return combineLatest([
    questionService.completed$,
    doubleUpService.completed$,
  ]).pipe(
    map((stream) => stream.every((val) => val)),
    tap((success) => {
      if (!success) {
        router.navigate([...getPathFromRootAsArray(route), 'qa']);
      }
    }),
  );
};
