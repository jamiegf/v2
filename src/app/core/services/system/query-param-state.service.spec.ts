import { TestBed } from '@angular/core/testing';

import { QueryParamStateService } from './query-param-state.service';

describe('QueryParamStateService', () => {
  let service: QueryParamStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryParamStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
