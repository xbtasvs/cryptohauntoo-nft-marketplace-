import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummoningComponent } from './summoning.component';

describe('SummoningComponent', () => {
  let component: SummoningComponent;
  let fixture: ComponentFixture<SummoningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummoningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummoningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
