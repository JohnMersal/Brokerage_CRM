import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLevelComponent } from './new-level.component';

describe('NewLevelComponent', () => {
  let component: NewLevelComponent;
  let fixture: ComponentFixture<NewLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
