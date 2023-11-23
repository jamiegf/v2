import { TestBed } from '@angular/core/testing';

import { FetchPoolInfoService } from './fetch-pool-info.service';

describe('PoolInfoService', () => {
  let service: FetchPoolInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchPoolInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
