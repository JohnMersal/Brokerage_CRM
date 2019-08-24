import { TestBed } from '@angular/core/testing';

import { GamificationsService } from './gamifications.service';

describe('GamificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamificationsService = TestBed.get(GamificationsService);
    expect(service).toBeTruthy();
  });
});
