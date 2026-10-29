import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../core/admin.service';

@Component({
  selector: 'app-exam-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './exam-settings.html',
  styleUrl: './exam-settings.css',
})
export class ExamSettings {
  private fb = inject(FormBuilder);
  private api = inject(AdminService);

  message = signal('');
  error = signal('');
  form = this.fb.group({
    questionCount: [20, [Validators.required, Validators.min(1)]],
    durationMinutes: [20, [Validators.required, Validators.min(1)]]
  });

  constructor() {
    this.api.settings().subscribe(s => this.form.patchValue(s));
  }

  save() {
    this.message.set('');
    this.error.set('');
    const v = this.form.getRawValue();
    this.api.updateSettings({
      questionCount: Number(v.questionCount),
      durationMinutes: Number(v.durationMinutes)
    }).subscribe({
      next: () => this.message.set('Saved. New exams will use these values.'),
      error: e => this.error.set(e.error?.message ?? 'Could not save the settings')
    });
  }
}
