import { TestBed } from '@angular/core/testing';

import { TokensDatasourceService } from './tokens-datasource.service';

describe('TokensDatasourceService', () => {
  let service: TokensDatasourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokensDatasourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
