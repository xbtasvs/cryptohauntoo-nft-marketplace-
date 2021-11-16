import { TestBed } from '@angular/core/testing';

import { MetaserviceService } from './metaservice.service';

describe('MetaserviceService', () => {
  let service: MetaserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
