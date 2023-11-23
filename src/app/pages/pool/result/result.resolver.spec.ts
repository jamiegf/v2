import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { resultResolver } from './result.resolver';

describe('resultResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => resultResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
