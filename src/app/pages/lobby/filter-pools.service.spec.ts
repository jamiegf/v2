import { TestBed } from '@angular/core/testing';

import { FilterPoolsService } from './filter-pools.service';

describe('FilterPoolsService', () => {
  let service: FilterPoolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterPoolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
