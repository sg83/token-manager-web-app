import { TestBed } from '@angular/core/testing';

import { AdminAuthDataService } from './admin-auth-data.service';

describe('AdminAuthDataService', () => {
  let service: AdminAuthDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAuthDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
