import { TestBed } from '@angular/core/testing';

import { BrokersService } from './brokers.service';

describe('BrokersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrokersService = TestBed.get(BrokersService);
    expect(service).toBeTruthy();
  });
});
