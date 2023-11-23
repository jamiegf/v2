import { TestBed } from '@angular/core/testing';

import { PoolInfoService } from './pool-info.service';

describe('PoolInfoService', () => {
  let service: PoolInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoolInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
