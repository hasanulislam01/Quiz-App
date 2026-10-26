import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../core/quiz.service';
import { Category, ExamSettings } from '../core/models';

@Component({
  selector: 'app-home',
  template: `
    <h2>Choose a quiz</h2>
    @if (settings(); as s) {
      <p class="muted">Each exam has {{ s.questionCount }} random questions and a time limit of {{ s.durationMinutes }} minutes.</p>
    }
    @if (error()) { <p class="error">{{ error() }}</p> }
    <div class="grid">
      @for (c of categories(); track c.id) {
        <div class="card">
          <h3>{{ c.name }}</h3>
          <p class="muted">{{ c.description }}</p>
          <p class="muted">{{ c.questionCount }} questions available</p>
          <button class="btn" (click)="start(c)" [disabled]="starting() !== null">
            {{ starting() === c.id ? 'Starting...' : 'Start' }}
          </button>
        </div>
      }
    </div>
  `
})
export class HomeComponent {
  private api = inject(QuizService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  settings = signal<ExamSettings | null>(null);
  starting = signal<number | null>(null);
  error = signal('');

  constructor() {
    this.api.categories().subscribe(c => this.categories.set(c));
    this.api.settings().subscribe(s => this.settings.set(s));
  }

  start(c: Category) {
    this.error.set('');
    this.starting.set(c.id);
    this.api.start(c.id).subscribe({
      next: attempt => this.router.navigate(['/quiz', attempt.id]),
      error: e => {
        this.error.set(e.error?.message ?? 'Could not start the exam');
        this.starting.set(null);
      }
    });
  }
}