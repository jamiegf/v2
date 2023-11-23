import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { filterPoolsGuard } from './filter-pools.guard';

describe('filterPoolsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => filterPoolsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
