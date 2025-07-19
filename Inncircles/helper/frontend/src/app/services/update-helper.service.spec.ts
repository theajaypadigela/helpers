import { TestBed } from '@angular/core/testing';

import { UpdateHelperService } from './update-helper.service';

describe('UpdateHelperService', () => {
  let service: UpdateHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
