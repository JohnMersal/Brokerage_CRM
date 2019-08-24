import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAreasComponent } from './new-areas.component';

describe('NewAreasComponent', () => {
  let component: NewAreasComponent;
  let fixture: ComponentFixture<NewAreasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAreasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
