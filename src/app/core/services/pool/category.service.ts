import { Injectable } from '@angular/core';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { CategoryId } from 'src/app/core/models/pool/category/category-id.type';
import { Category } from 'src/app/core/models/pool/category/category.type';
import { PoolInfoService } from 'src/app/core/services/pool/pool-info.service';
import { Logger } from 'src/app/lib/logger';
import {
  CategoryFilter,
  FilterPoolsService,
} from 'src/app/pages/lobby/filter-pools.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private poolInfoService: PoolInfoService,
    private filterPoolsService: FilterPoolsService,
  ) {}

  public availableCategoryData$: Observable<CategoryData[] | undefined> =
    this.poolInfoService.poolInfo$.pipe(
      map((poolInfo) => {
        if (poolInfo === undefined) return undefined;
        const categoryIconMap = new Map<CategoryId, CategoryData>();
        poolInfo.reduce((ciMap, current) => {
          if (current.statusMap.available === false) return ciMap;
          const data = ciMap.get(current.category.id) || {
            category: current.category,
            count: 0,
          };
          data.count += 1;
          ciMap.set(current.category.id, data);
          return ciMap;
        }, categoryIconMap);
        return Array.from(categoryIconMap.values());
      }),
      tap((categories) => Logger.getLogger().debug(['categories', categories])),
      shareReplay(1),
    );

  public readonly categoryFilter$: Observable<CategoryFilter | undefined> =
    this.filterPoolsService.filterOptions$.pipe(
      map((filter) => filter?.categoryFilter),
      shareReplay(1),
    );
}

export interface CategoryData {
  category: Category;
  count: number;
}
