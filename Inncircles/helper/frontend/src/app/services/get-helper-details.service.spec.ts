import { TestBed } from '@angular/core/testing';

import { GetHelperDetailsService } from './get-helper-details.service';

describe('GetHelperDetailsService', () => {
  let service: GetHelperDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetHelperDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
