import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CategoryUrlToCategoryId } from 'src/app/core/models/pool/category/url-to-category-map.type';
import { FilterPoolsService } from 'src/app/pages/lobby/filter-pools.service';

export const filterPoolsGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const filterPoolsService = inject(FilterPoolsService);
  if (state.url === '/lobby') {
    filterPoolsService.setFilter(undefined);
    return true;
  }
  let success = true;
  if (route.params['category']) {
    success = updateFilterWithCategory(
      route.params['category'],
      filterPoolsService,
    );
  }
  if (!success) {
    router.navigateByUrl('404', { skipLocationChange: true });
  }
  return success;
};

const updateFilterWithCategory = (
  categoryUrl: unknown,
  filterPoolsService: FilterPoolsService,
): boolean => {
  if (typeof categoryUrl !== 'string') return false;
  const categoryId = CategoryUrlToCategoryId(categoryUrl);
  if (categoryId === undefined) return false;
  filterPoolsService.setFilter({
    categoryFilter: { [categoryId]: true },
  });
  return true;
};
