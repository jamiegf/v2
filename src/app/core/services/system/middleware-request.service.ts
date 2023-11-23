import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of } from 'rxjs';
import {
  MiddlewareResponse,
  MiddlewareStatusCode,
} from 'src/app/core/models/middleware-response.interface';
import { CookiesService } from 'src/app/core/services/system/cookies.service';
import { Logger } from 'src/app/lib/logger';
import { transformToError } from 'src/app/lib/transform-to-error';

@Injectable({
  providedIn: 'root',
})
export class MiddlewareRequestService {
  public jwtErrorEvent: Subject<void> = new Subject<void>();

  constructor(
    private cookiesService: CookiesService,
    private http: HttpClient,
  ) {}

  /**
   * make a post request to the MiPools Middleware, handles errors
   * @param url
   * @param body undefined or a js string dictionary object, will be converted into url search params
   * @param headers
   * @returns type T is the Data field of the middleware response
   */
  public post<T>(
    url: string,
    body: Record<string, string> | undefined = undefined,
    headers?: Record<string, string>,
  ): Observable<T | Error> {
    let middlewareHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      ...headers,
    });
    const jwt = this.cookiesService.getItem('jwt');
    let formUrlEncoded: string | undefined = undefined;
    if (jwt) middlewareHeaders = middlewareHeaders.set('x-api-jwtToken', jwt);
    if (body) {
      formUrlEncoded = new URLSearchParams(Object.entries(body)).toString();
    }
    return this.http
      .post<MiddlewareResponse<T>>(url, formUrlEncoded, {
        headers: middlewareHeaders,
      })
      .pipe(
        map((res) => {
          if (res.Status === 0) return res.Data;
          if (res.Status === 42 || res.Status === 20) this.handleJwtErrors();
          throw new MiddlewareError(
            res.Status,
            res.ErrorMessage ||
              'Unknown error occurred, please try again later. Contact support if this issue persists.',
            { cause: res },
          );
        }),
        catchError((err: unknown) => {
          const error = transformToError(err);
          Logger.getLogger().error(error);
          return of(error);
        }),
      );
  }

  private handleJwtErrors(): void {
    this.jwtErrorEvent.next();
    this.cookiesService.removeItem('jwt');
  }
}

export class MiddlewareError extends Error {
  constructor(
    public status: MiddlewareStatusCode,
    message: string,
    options: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'MiddlewareError';
  }
}
