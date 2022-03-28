import { TestBed } from '@angular/core/testing';

import { PairwiseService } from './pairwise.service';

describe('PairwiseService', () => {
  let service: PairwiseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PairwiseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
