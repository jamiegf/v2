import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  shareReplay,
  tap,
} from 'rxjs';
import { CategoryId } from 'src/app/core/models/pool/category/category-id.type';
import { PoolInfo } from 'src/app/core/models/pool/pool-info/pool-info.class';
import { PoolInfoService } from 'src/app/core/services/pool/pool-info.service';
import { assertUnreachable } from 'src/app/lib/assert-unreachable';
import { Logger } from 'src/app/lib/logger';

@Injectable({
  providedIn: 'root',
})
export class FilterPoolsService {
  private filterOptionsSubject$ = new BehaviorSubject<
    PoolFilterOptions | undefined
  >(undefined);
  public filterOptions$ = this.filterOptionsSubject$.asObservable();
  public filteredPools$: Observable<PoolInfo[] | undefined> = combineLatest({
    pools: this.poolInfoService.poolInfo$,
    filter: this.filterOptions$,
  }).pipe(
    map((stream) => {
      return filterPools(stream.pools, stream.filter);
    }),
    tap((pools) => Logger.getLogger().debug(['filtered pools', pools])),
    shareReplay(1),
  );

  constructor(private poolInfoService: PoolInfoService) {}

  public setFilter(options?: PoolFilterOptions): void {
    this.filterOptionsSubject$.next(options);
  }
}

export function filterPools(
  pools: PoolInfo[] | undefined,
  filter: PoolFilterOptions | undefined,
): PoolInfo[] | undefined {
  if (pools === undefined) return undefined;
  if (filter === undefined) return sortPools(pools);
  if (filter.categoryFilter) {
    pools = filterPoolsByCategory(pools, filter.categoryFilter);
  }
  pools = sortPools(pools, filter.sort);
  return pools;
}

function filterPoolsByCategory(
  pools: PoolInfo[],
  categoryFilter: CategoryFilter,
): PoolInfo[] {
  return pools.filter((pool) => categoryFilter[pool.category.id]);
}

function sortPools(
  pools: PoolInfo[],
  sortType: SortType = 'closeDateAscending',
): PoolInfo[] {
  switch (sortType) {
    case 'closeDateAscending':
      return pools.sort(
        (a, b) => a.closeDate.getTime() - b.closeDate.getTime(),
      );
    case 'closeDateDescending':
      return pools.sort(
        (a, b) => b.closeDate.getTime() - a.closeDate.getTime(),
      );
    default:
      throw assertUnreachable(sortType);
  }
}

/**
 * Options for filtering service
 */
export interface PoolFilterOptions {
  /**
   * Which categories to include in filtered output
   * @default all
   */
  categoryFilter?: CategoryFilter;
  /**
   * What sort type to use
   * @default closeDateAscending
   */
  sort?: SortType;
}

export type CategoryFilter = Partial<{ [key in CategoryId]: boolean }>;
export type SortType = 'closeDateAscending' | 'closeDateDescending';
