import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetPointsComponent } from './target-points.component';

describe('TargetPointsComponent', () => {
  let component: TargetPointsComponent;
  let fixture: ComponentFixture<TargetPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
