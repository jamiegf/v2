import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import {
  Observable,
  ReplaySubject,
  catchError,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { AuthenticatorRedirectService } from 'src/app/core/services/system/authenticator-redirect.service';
import { CookiesService } from 'src/app/core/services/system/cookies.service';
import { MiddlewareRequestService } from 'src/app/core/services/system/middleware-request.service';
import {
  StorageItem,
  StorageService,
} from 'src/app/core/services/system/storage.service';

import { TransferStateService } from 'src/app/core/services/system/transfer-state.service';
import { WindowService } from 'src/app/core/services/system/window.service';
import { Logger } from 'src/app/lib/logger';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsService {
  private userDetails$ = new ReplaySubject<UserDetails | undefined>(1);

  public readonly loggedIn$ = this.userDetails$.pipe(
    map((userDetails) => userDetails !== undefined),
    distinctUntilChanged(),
  );

  public readonly name$ = this.userDetails$.pipe(
    map((userDetails) => {
      return userDetails
        ? `${userDetails.MainDetails.FirstName} ${userDetails.MainDetails.LastName}`
        : undefined;
    }),
  );

  public readonly username$ = this.userDetails$.pipe(
    map((userDetails) => userDetails?.MainDetails.GEPlayerName),
  );

  constructor(
    private authenticatorRedirectService: AuthenticatorRedirectService,
    private cookiesService: CookiesService,
    private middlewareRequestService: MiddlewareRequestService,
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private transferStateService: TransferStateService,
    private windowService: WindowService,
  ) {
    this.middlewareRequestService.jwtErrorEvent.subscribe(() => {
      this.logout();
    });
  }

  public initialise(): Observable<unknown> {
    return this.getUserDetailsFromStateOrTokens().pipe(
      tap((userDetails) => {
        this.stripSsoTokenFromUrl();
        if (userDetails) {
          this.userDetails$.next(userDetails);
          this.cookiesService.setItem({
            key: 'jwt',
            value: userDetails.JWTtoken,
            expires: new Date(userDetails.JWTtokenExpiryTime),
          });
          this.transferStateService.set('userDetails', userDetails);
        } else {
          this.clearUserState();
        }
      }),
    );
  }

  /**
   * THIS FUNCTION IS VITAL
   * removing it stops the SSR route resolution, I have no idea why, need to look into it.
   * // TODO
   */
  private stripSsoTokenFromUrl(): void {
    const currUrl = this.windowService.url;
    const params: Params = Array.from(
      currUrl.searchParams.entries(),
    ).reduce<Params>((params, param) => {
      if (param[0] !== 'token') {
        params[param[0]] = param[1];
      }
      return params;
    }, {});
    this.router.navigate([currUrl.pathname], {
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  public getUserDetailsFromStateOrTokens(): Observable<
    UserDetails | undefined
  > {
    const user = this.transferStateService.get<UserDetails | null>(
      'userDetails',
      null,
    );
    Logger.getLogger().debug(['user', user]);
    if (user) {
      return of(user);
    }

    const jwt = this.cookiesService.getItem('jwt');
    Logger.getLogger().debug(['jwt', jwt]);
    if (jwt) {
      return this.fetchUserDetails$();
    }

    const ssoToken = this.getSsoTokenFromUrl();
    Logger.getLogger().debug(['ssoToken', ssoToken]);
    if (ssoToken) {
      return this.verifySsoToken(ssoToken).pipe(
        switchMap((res) => {
          if (res instanceof Error) return of(undefined);
          return this.fetchUserDetails$();
        }),
      );
    }

    return of(undefined);
  }

  public logout(): void {
    this.clearUserState();
    this.authenticatorRedirectService.redirectToLogout();
  }

  private clearUserState(): void {
    this.userDetails$.next(undefined);
    this.cookiesService.removeItem('jwt');
  }

  public getSsoTokenFromUrl(): string | null {
    const token = this.windowService.url.searchParams.get('token');
    if (!token) return null;
    if (this.storageService.get(StorageItem.USED_TOKEN) === token) {
      return null;
    } else {
      this.storageService.set(StorageItem.USED_TOKEN, token);
      return token;
    }
  }

  public verifySsoToken(token: string) {
    return this.http
      .post<AuthenticatorResponse>(
        environment.api.authenticator.verifySsoToken,
        {
          token,
        },
      )
      .pipe(
        catchError((error) => {
          let errorMessage = 'Unknown error occurred, please try again later.';
          if (error.error instanceof Object && error.error?.data) {
            const response: { errorMessage?: string; ErrorMessage?: string } =
              error.error.data;
            errorMessage =
              response.ErrorMessage || response.errorMessage || errorMessage;
          }
          return of(new Error(errorMessage));
        }),
        tap((res) => {
          if (!(res instanceof Error) && res.data.status === 0) {
            this.cookiesService.setItem({
              key: 'jwt',
              value: res.data.data.jwt,
            });
          }
        }),
      );
  }

  private fetchUserDetails$() {
    return this.middlewareRequestService
      .post<UserDetails>(environment.api.middleware.getPlayerDetails, undefined)
      .pipe(
        map((userDetails) => {
          return userDetails instanceof Error ? undefined : userDetails;
        }),
      );
  }
}

interface AuthenticatorResponse {
  data: {
    data: { jwt: string };
    devMessage: null;
    errorCode: null;
    errorMessage: null;
    errorTitle: null;
    method: null;
    status: 0;
    timestamp: string;
  };
  success: true;
}

interface UserDetails {
  GEToken: string;
  IntercomHash: string;
  Balance: number;
  LastLogin: string;
  JWTtoken: string;
  JWTtokenExpiryTime: string;
  MainDetails: {
    PlayerId: number;
    Title: string;
    DOB: string;
    FirstName: string;
    MiddleName: unknown;
    LastName: string;
    GEPlayerName: string;
    Email: string;
    PhoneNumber: string;
    Address: string;
    City: string;
    ZipCode: string;
    StateOrProvince: string;
    CountryID: number;
    Code: string;
    CountryISO3: string;
    Name: string;
    CurrencyID: number;
    CurrencyName: string;
    CurrencyShortname: string;
    CurrencySymbol: string;
    Description: string;
    PlayerRole: string;
    AdminLevel: number;
  };
  Limits: unknown[];
  Points: {
    PointsTypeID: number;
    Description: string;
    Amount: number;
  }[];
}
