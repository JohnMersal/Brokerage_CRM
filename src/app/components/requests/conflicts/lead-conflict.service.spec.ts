import { TestBed } from '@angular/core/testing';

import { LeadConflictService } from './lead-conflict.service';

describe('LeadConflictService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeadConflictService = TestBed.get(LeadConflictService);
    expect(service).toBeTruthy();
  });
});
