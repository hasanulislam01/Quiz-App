import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Attempts } from './attempts';

describe('Attempts', () => {
  let component: Attempts;
  let fixture: ComponentFixture<Attempts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Attempts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Attempts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
