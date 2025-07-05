import { TestBed } from '@angular/core/testing';

import { DeleteHelperService } from './delete-helper.service';

describe('DeleteHelperService', () => {
  let service: DeleteHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
