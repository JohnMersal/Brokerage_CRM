import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundsListComponent } from './compounds-list.component';

describe('CompoundsListComponent', () => {
  let component: CompoundsListComponent;
  let fixture: ComponentFixture<CompoundsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompoundsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
