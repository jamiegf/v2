import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject, Subject, combineLatest, switchMap } from 'rxjs';
import { PoolInfo } from 'src/app/core/models/pool/pool-info/pool-info.class';
import { FetchPoolInfoService } from 'src/app/core/services/pool/fetch-pool-info.service';
import { TimeoutService } from 'src/app/core/services/ssr-guards/timeout.service';
import { UserDetailsService } from 'src/app/core/services/user/user-details.service';

@Injectable({
  providedIn: 'root',
})
export class PoolInfoService {
  private readonly POLL_TIMEOUT_MS = 30000;
  private readonly poolInfoSubject$ = new ReplaySubject<PoolInfo[] | undefined>(
    1,
  );
  private readonly poll$ = new Subject<void>();
  private readonly request$ = combineLatest({
    loggedIn: this.userDetailsService.loggedIn$,
    poll: this.poll$,
  }).pipe(
    switchMap((stream) => {
      if (stream.loggedIn) {
        return this.fetchPoolInfoService.fetchPlayerGeneralPoolInfo$();
      } else {
        return this.fetchPoolInfoService.fetchPublicPoolInfo$();
      }
    }),
  );

  private timeout: ReturnType<TimeoutService['setTimeout']>;

  public readonly poolInfo$ = this.poolInfoSubject$.asObservable();

  constructor(
    private fetchPoolInfoService: FetchPoolInfoService,
    private ngZone: NgZone,
    private timeoutService: TimeoutService,
    private userDetailsService: UserDetailsService,
  ) {
    this.request$.subscribe((poolInfo) => {
      if (poolInfo !== undefined) {
        this.poolInfoSubject$.next(poolInfo);
      }
    });
    this.poll();
  }

  public poll(): void {
    this.timeoutService.clearTimeout(this.timeout);
    this.poll$.next();
    this.ngZone.runOutsideAngular(() => {
      this.timeoutService.setTimeout(
        () => this.ngZone.run(() => this.poll()),
        this.POLL_TIMEOUT_MS,
      );
    });
  }

  public stopPolling(): void {
    this.timeoutService.clearTimeout(this.timeout);
  }
}
