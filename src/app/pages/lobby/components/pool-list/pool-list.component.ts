import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  Observable,
  Subject,
  combineLatest,
  map,
  scan,
  shareReplay,
  startWith,
} from 'rxjs';
import { PoolInfo } from 'src/app/core/models/pool/pool-info/pool-info.class';
import { CategoryService } from 'src/app/core/services/pool/category.service';
import { BannerComponent } from 'src/app/pages/lobby/components/banner/banner.component';
import {
  CategoryFilter,
  FilterPoolsService,
} from 'src/app/pages/lobby/filter-pools.service';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { PoolCardContainerComponent } from 'src/app/shared/pool-card-container/pool-card-container.component';

@Component({
  selector: 'mipools-front-end-pool-list',
  standalone: true,
  imports: [
    CommonModule,
    BannerComponent,
    LoadingComponent,
    PoolCardContainerComponent,
    RouterModule,
  ],
  templateUrl: './pool-list.component.html',
  styleUrls: ['./pool-list.component.scss'],
})
export class PoolListComponent {
  public readonly POOL_SLICE_LENGTH = 8;
  private increaseSlice$ = new Subject<void>();
  private available$ = this.filterPoolsService.filteredPools$.pipe(
    map((pools) => {
      return pools?.filter((pool) => pool.statusMap.available);
    }),
    shareReplay(1),
  );

  public slice$ = this.increaseSlice$.pipe(
    scan((slice: number) => (slice += 1), 1),
    startWith(1),
    shareReplay(1),
  );
  public pools$ = combineLatest({
    pools: this.available$,
    slice: this.slice$,
  }).pipe(
    map((stream) => {
      const [pools, slice] = [stream.pools, stream.slice];
      if (pools === undefined) return undefined;
      const slicedPools: PoolInfo[][] = [];
      for (let i = 0; i < slice; i++) {
        if (i * this.POOL_SLICE_LENGTH > pools.length) break;
        slicedPools.push(
          pools.slice(
            i * this.POOL_SLICE_LENGTH,
            (i + 1) * this.POOL_SLICE_LENGTH,
          ),
        );
      }
      return slicedPools;
    }),
    shareReplay(1),
  );

  public displayShowMoreButton$ = combineLatest({
    pools: this.available$,
    slice: this.slice$,
  }).pipe(
    map((stream) => {
      if (stream.pools === undefined) return false;
      return stream.slice * this.POOL_SLICE_LENGTH < stream.pools.length;
    }),
    shareReplay(1),
  );

  constructor(
    private filterPoolsService: FilterPoolsService,
    public categoryService: CategoryService,
  ) {}

  public selectedCategories$: Observable<CategoryFilter | undefined> =
    this.filterPoolsService.filterOptions$.pipe(
      map((options) => options?.categoryFilter),
    );

  public showMore(): void {
    this.increaseSlice$.next();
  }

  public trackBy(_index: number, poolInfo: PoolInfo): string {
    return poolInfo.gameId;
  }

  public filtering$ = this.selectedCategories$.pipe(
    map((filter) => {
      if (!filter) return false;
      const values = Object.values(filter);
      for (let i = 0; i < values.length; i++) {
        if (values[i]) return true;
      }
      return false;
    }),
  );
}
