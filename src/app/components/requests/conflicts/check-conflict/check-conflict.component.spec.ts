import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckConflictComponent } from './check-conflict.component';

describe('CheckConflictComponent', () => {
  let component: CheckConflictComponent;
  let fixture: ComponentFixture<CheckConflictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckConflictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckConflictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
