import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompitationComponent } from './compitation.component';

describe('CompitationComponent', () => {
  let component: CompitationComponent;
  let fixture: ComponentFixture<CompitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
