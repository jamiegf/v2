import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import packageJson from '../../../../package.json';
import { TimeoutService } from 'src/app/core/services/ssr-guards/timeout.service';
import { format } from 'date-fns';

@Component({
  selector: 'mipools-front-end-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public version = packageJson.version;

  public time: string = this.getTime();
  public date: string = this.getDate();
  public year: string = this.getYear();

  constructor(
    private ngZone: NgZone,
    private timeoutService: TimeoutService,
  ) {
    this.updateDateTime();
  }

  private updateDateTime(): void {
    this.ngZone.runOutsideAngular(() => {
      this.timeoutService.setTimeout(() => {
        this.ngZone.run(() => {
          this.time = this.getTime();
          this.date = this.getDate();
          this.year = this.getYear();
          this.updateDateTime();
        });
      }, 1000);
    });
  }

  private getTime(): string {
    return format(new Date(), 'HH:mm');
  }

  private getDate(): string {
    return format(new Date(), 'dd LLL yyyy');
  }

  private getYear(): string {
    return format(new Date(), 'yyyy');
  }

  openCookies() {
    alert('open cookies - need to do');
  }
}
