import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HauntooComponent } from './hauntoo.component';

describe('HauntooComponent', () => {
  let component: HauntooComponent;
  let fixture: ComponentFixture<HauntooComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HauntooComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HauntooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
