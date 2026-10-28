import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAttempts } from './my-attempts';

describe('MyAttempts', () => {
  let component: MyAttempts;
  let fixture: ComponentFixture<MyAttempts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAttempts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAttempts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
