import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyhauntooComponent } from './myhauntoo.component';

describe('MyhauntooComponent', () => {
  let component: MyhauntooComponent;
  let fixture: ComponentFixture<MyhauntooComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyhauntooComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyhauntooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
