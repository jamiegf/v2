import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ReplaySubject, catchError, map, of, tap } from 'rxjs';
import { Logger } from 'src/app/lib/logger';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GetAddressService {
  private http = inject(HttpClient);

  private _addresses$ = new ReplaySubject<Address[]>();
  public addresses$ = this._addresses$.asObservable();

  public searchPostcode(postcode: string): void {
    this.http
      .get<{ addresses: string[] }>(
        `${environment.getAddress.url}/${postcode}?api-key=${environment.getAddress.apiKey}`,
      )
      .pipe(
        catchError((error) => {
          Logger.getLogger().error(error);
          return of({ addresses: [] });
        }),
        map((res) =>
          res.addresses.map<Address>((address) => {
            const split = address.split(',');
            return [
              split[0].trim() || '',
              split[1].trim() || '',
              split.at(-1)?.trim() || '',
              postcode,
            ];
          }),
        ),
        tap((addresses) => {
          // TODO show dialog if no addresses found
        }),
      )
      .subscribe((addresses) => this._addresses$.next(addresses));
  }
}

export type Address = [string, string, string, string];
