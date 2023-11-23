import { Injectable } from '@angular/core';
import { WindowService } from 'src/app/core/services/system/window.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatorRedirectService {
  constructor(private windowService: WindowService) {}

  public redirectToLogin(urlToRedirectBackTo?: string): void {
    this.windowService.href = `${environment.authenticatorUrl}/login?redirect=${
      urlToRedirectBackTo
        ? this.windowService.origin + urlToRedirectBackTo
        : this.windowService.href
    }`;
  }

  public redirectToLoginAbsolute(urlToRedirectBackTo: string): void {
    try {
      const url = new URL(urlToRedirectBackTo);
      this.windowService.href = `${
        environment.authenticatorUrl
      }/login?redirect=${encodeURIComponent(url.toString())}`;
    } catch (error) {
      console.error('invalid url', urlToRedirectBackTo);
    }
  }

  public redirectToLogout(urlToRedirectBackTo?: string): void {
    this.windowService.href = `${
      environment.authenticatorUrl
    }/logout?redirect=${
      urlToRedirectBackTo
        ? this.windowService.origin + '/' + urlToRedirectBackTo
        : this.windowService.href
    }`;
  }

  public redirectToLoginThroughLogout(urlToRedirectBackTo?: string): void {
    const redirect = encodeURIComponent(
      `${environment.authenticatorUrl}/login?redirect=${
        urlToRedirectBackTo
          ? this.windowService.origin + '/' + urlToRedirectBackTo
          : this.windowService.href
      }`,
    );
    this.windowService.href = `${environment.authenticatorUrl}/logout?redirect=${redirect}`;
  }
}
