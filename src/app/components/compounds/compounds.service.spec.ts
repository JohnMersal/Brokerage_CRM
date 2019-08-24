import { TestBed } from '@angular/core/testing';

import { CompoundsService } from './compounds.service';

describe('CompoundsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompoundsService = TestBed.get(CompoundsService);
    expect(service).toBeTruthy();
  });
});
