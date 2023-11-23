import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { RouterHistoryService } from 'src/app/core/services/system/router-history.service';
import {
  EnterPoolResult,
  FailedEnterPoolResult,
  SuccessfulEnterPoolResult,
} from 'src/app/pages/pool/enter-pool.service';

@Component({
  selector: 'mipools-front-end-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent {
  public results$: Observable<undefined | EnterPoolResult[]> =
    this.route.data.pipe(map((data) => data['results']));
  public successful$: Observable<SuccessfulEnterPoolResult[] | undefined> =
    this.results$.pipe(
      map(
        (results) =>
          results?.filter(
            (result): result is SuccessfulEnterPoolResult => 'seatId' in result,
          ),
      ),
    );
  public failed$: Observable<FailedEnterPoolResult[] | undefined> =
    this.results$.pipe(
      map(
        (results) =>
          results?.filter(
            (result): result is FailedEnterPoolResult => 'error' in result,
          ),
      ),
    );
  constructor(
    private route: ActivatedRoute,
    public routerHistoryService: RouterHistoryService,
  ) {}
}
