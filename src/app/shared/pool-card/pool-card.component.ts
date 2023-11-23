import { CommonModule } from '@angular/common';
import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { intervalToDuration, isAfter } from 'date-fns';
import { Observable, ReplaySubject } from 'rxjs';
import { PoolInfo } from 'src/app/core/models/pool/pool-info/pool-info.class';
import { FormatDatePipe } from 'src/app/core/pipes/format-date.pipe';
import { TimeoutService } from 'src/app/core/services/ssr-guards/timeout.service';

@Component({
  selector: 'mipools-front-end-pool-card[pool]',
  standalone: true,
  imports: [CommonModule, FormatDatePipe],
  templateUrl: './pool-card.component.html',
  styleUrls: ['./pool-card.component.scss'],
})
export class PoolCardComponent implements OnInit, OnDestroy {
  @Input() public pool!: PoolInfo;

  private timeout: ReturnType<TimeoutService['setTimeout']>;
  private countdown$$ = new ReplaySubject<string>(1);

  public countdown$: Observable<string> = this.countdown$$.asObservable();

  constructor(
    private ngZone: NgZone,
    private timeoutService: TimeoutService,
  ) {}

  ngOnInit(): void {
    this.countdownTick();
  }

  private countdownTick() {
    const now = new Date();
    if (isAfter(this.pool.closeDate, now)) {
      this.ngZone.run(() => {
        this.countdown$$.next(
          this.generateCountdownText(now, this.pool.closeDate),
        );
      });
      this.ngZone.runOutsideAngular(() => {
        this.timeout = this.timeoutService.setTimeout(() => {
          this.countdownTick();
        }, 1000);
      });
    } else {
      this.countdown$$.next('Closed');
    }
  }

  private generateCountdownText(startDate: Date, endDate: Date): string {
    const duration = intervalToDuration({
      start: startDate,
      end: endDate,
    });

    const days = duration.days || undefined;
    const hours = duration.hours || undefined;
    const minutes = duration.minutes || undefined;
    const seconds = duration.seconds || undefined;

    let countdown = '';

    if (days) countdown += `${days} days `;
    if (hours) countdown += `${hours} hrs `;
    if (!days && hours) countdown += `${minutes} mins `;
    if (!days && !hours && seconds) countdown += `${seconds} secs `;

    if (!countdown) return '';
    else return 'Closes: ' + countdown.trim();
  }

  ngOnDestroy(): void {
    this.timeoutService.clearTimeout(this.timeout);
  }
}
