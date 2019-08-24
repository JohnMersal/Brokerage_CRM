import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyHourComponent } from './happy-hour.component';

describe('HappyHourComponent', () => {
  let component: HappyHourComponent;
  let fixture: ComponentFixture<HappyHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HappyHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HappyHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
