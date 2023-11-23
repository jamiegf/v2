import { TestBed } from '@angular/core/testing';

import { PoolFoldOutCardService } from './pool-fold-out-card.service';

describe('PoolFoldOutCardService', () => {
  let service: PoolFoldOutCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoolFoldOutCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
