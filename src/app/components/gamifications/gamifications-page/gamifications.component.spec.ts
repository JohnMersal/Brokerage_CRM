import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamificationsComponent } from './gamifications.component';

describe('GamificationsComponent', () => {
  let component: GamificationsComponent;
  let fixture: ComponentFixture<GamificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
