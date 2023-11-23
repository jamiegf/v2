import { TestBed } from '@angular/core/testing';

import { PoolDetailsService } from './pool-details.service';

describe('PoolDetailsService', () => {
  let service: PoolDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoolDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
