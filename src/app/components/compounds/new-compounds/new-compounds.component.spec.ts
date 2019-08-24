import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCompoundsComponent } from './new-compounds.component';

describe('NewCompoundsComponent', () => {
  let component: NewCompoundsComponent;
  let fixture: ComponentFixture<NewCompoundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCompoundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCompoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
