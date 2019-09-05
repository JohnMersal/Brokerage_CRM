import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolveconflictsComponent } from './solveconflicts.component';

describe('SolveconflictsComponent', () => {
  let component: SolveconflictsComponent;
  let fixture: ComponentFixture<SolveconflictsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolveconflictsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolveconflictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
