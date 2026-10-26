import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../core/admin.service';

@Component({
  selector: 'app-admin-settings',
  imports: [ReactiveFormsModule],
  template: `
    <h2>Exam settings</h2>
    <div class="card narrow" style="margin-left:0">
      <p class="muted">These values apply to every category. Exams that are already in progress keep their original values.</p>
      <form [formGroup]="form" (ngSubmit)="save()">
        <label>Questions per exam</label>
        <input type="number" min="1" formControlName="questionCount">
        <label>Duration (minutes)</label>
        <input type="number" min="1" formControlName="durationMinutes">
        @if (message()) { <p>{{ message() }}</p> }
        @if (error()) { <p class="error">{{ error() }}</p> }
        <div class="row">
          <button class="btn" type="submit" [disabled]="form.invalid">Save settings</button>
        </div>
      </form>
    </div>
  `
})
export class AdminSettingsComponent {
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