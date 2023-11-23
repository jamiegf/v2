import { TestBed } from '@angular/core/testing';

import { PlayerTransactionsService } from './player-transactions.service';

describe('PlayerTransactionsService', () => {
  let service: PlayerTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
