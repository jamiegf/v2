import {
  Observable,
  ReplaySubject,
  Subject,
  map,
  merge,
  scan,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { MiddlewareRequestService } from 'src/app/core/services/system/middleware-request.service';
import { UserDetailsService } from 'src/app/core/services/user/user-details.service';
import { Logger } from 'src/app/lib/logger';

export abstract class UserDataService<
  MiddlewareResponse,
  Data,
  Request extends Record<string, string> | undefined = undefined,
> {
  private readonly dataOutput$ = new Subject<Data | undefined | null>(); // is this safe as a non behaviour?
  private readonly refreshData$ = new ReplaySubject<Request | undefined>(1);

  /**
   * data output, null is loading, undefined is no data
   */
  private readonly data$$ = this.dataOutput$.pipe(
    scan((state, stream) => {
      return this.differ(state, stream) ? stream : state;
    }),
    shareReplay(1),
  );

  protected readonly data$: Observable<null | undefined | Data> = merge(
    this.userDetailsService.loggedIn$.pipe(
      map((loggedIn): ['loggedIn', boolean] => ['loggedIn', loggedIn]),
    ),
    this.refreshData$.pipe(
      map((request): ['refresh', Request | undefined] => ['refresh', request]),
    ),
  ).pipe(
    scan(
      (state: UserDataServiceState<Request>, stream) => {
        if (stream[0] === 'loggedIn') state.loggedIn = stream[1];
        if (stream[0] === 'refresh') {
          state.requestCache = stream[1];
        }
        if (state.loggedIn && state.requestCache !== null) {
          this.fetchData(state.requestCache);
        } else {
          state.requestCache = null;
          this.dataOutput$.next(undefined);
        }
        return state;
      },
      {
        loggedIn: false,
        requestCache: null,
      },
    ),
    switchMap(() => {
      return this.data$$;
    }),
    shareReplay(1),
  );

  constructor(
    private dataServiceOptions: UserDataServiceOptions,
    private middlewareRequestService: MiddlewareRequestService,
    private userDetailsService: UserDetailsService,
  ) {}

  /**
   * make a fetch request to the middleware and update the subject with the response
   * @param request request body to send
   */
  public refreshData(request?: Request, setLoading = false): void {
    if (setLoading) this.dataOutput$.next(null);
    this.refreshData$.next(request);
  }

  public clearData(): void {
    this.dataOutput$.next(undefined);
  }

  /**
   * map incoming response data to output type
   * @param data
   */
  protected abstract mapFunction(
    data: MiddlewareResponse | Error,
  ): Data | Error;
  /**
   * apply a differing function to decide whether or not incoming data should be emitted
   * @param data
   */
  protected differ(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentData: Data | undefined | null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    incomingData: Data | undefined | null,
  ): boolean {
    return true;
  }

  private fetchData(body: Request | undefined): void {
    this.middlewareRequestService
      .post<MiddlewareResponse>(this.dataServiceOptions.apiUrl, body)
      .pipe(
        map((data) => this.mapFunction(data)),
        tap((data) =>
          Logger.getLogger().debug([this.dataServiceOptions.logTitle, data]),
        ),
      )
      .subscribe((data: Data | Error) => {
        if (data instanceof Error) {
          this.dataOutput$.next(undefined);
        } else {
          this.dataOutput$.next(data);
        }
      });
  }
}

interface UserDataServiceState<Request> {
  loggedIn: boolean;
  requestCache: null | Request | undefined;
}

interface UserDataServiceOptions {
  apiUrl: string;
  logTitle: string;
}
