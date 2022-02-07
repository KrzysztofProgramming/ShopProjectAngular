import { TestBed } from '@angular/core/testing';

import { PermsService } from './perms.service';

describe('PermsService', () => {
  let service: PermsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
