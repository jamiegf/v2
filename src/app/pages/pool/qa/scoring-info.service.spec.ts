import { TestBed } from '@angular/core/testing';

import { ScoringInfoService } from './scoring-info.service';

describe('ScoringInfoService', () => {
  let service: ScoringInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoringInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
