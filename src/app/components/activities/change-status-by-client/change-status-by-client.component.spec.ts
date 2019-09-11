import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStatusByClientComponent } from './change-status-by-client.component';

describe('ChangeStatusByClientComponent', () => {
  let component: ChangeStatusByClientComponent;
  let fixture: ComponentFixture<ChangeStatusByClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeStatusByClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStatusByClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
