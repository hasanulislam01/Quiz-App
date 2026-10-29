import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSettings } from './exam-settings';

describe('ExamSettings', () => {
  let component: ExamSettings;
  let fixture: ComponentFixture<ExamSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
