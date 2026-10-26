import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuizService } from '../core/quiz.service';
import { AttemptDetail } from '../core/models';

@Component({
  selector: 'app-result',
  imports: [RouterLink],
  template: `
    @if (error()) { <p class="error">{{ error() }}</p> }
    @if (attempt(); as a) {
      <div class="card">
        <h2>{{ a.categoryName }}</h2>
        @if (isAdmin) { <p class="muted">Taken by {{ a.userName }}</p> }
        <p class="score">{{ a.score }} / {{ a.total }} ({{ percent() }}%)</p>
        @if (a.status === 'EXPIRED') {
          <p class="error">Time ran out before this exam was submitted.</p>
        }
        <a class="btn" [routerLink]="isAdmin ? '/admin/attempts' : '/home'">
          {{ isAdmin ? 'Back to attempts' : 'Take another quiz' }}
        </a>
      </div>

      <h3>Answer review</h3>
      @for (item of a.review ?? []; track item.questionId; let i = $index) {
        <div class="card">
          <h4 style="margin-top:0">{{ i + 1 }}. {{ item.text }}</h4>
          @for (o of item.options; track o.id) {
            <div class="choice" [class.correct]="o.correct"
                 [class.wrong]="o.id === item.selectedOptionId && !o.correct">
              {{ o.text }}
              @if (o.correct) { <span class="tag">Correct answer</span> }
              @if (o.id === item.selectedOptionId) { <span class="tag">Selected</span> }
            </div>
          }
          @if (item.selectedOptionId == null) { <p class="muted">Not answered</p> }
        </div>
      }
    }
  `
})
export class ResultComponent {
  private api = inject(QuizService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isAdmin = this.route.snapshot.data['admin'] === true;
  attempt = signal<AttemptDetail | null>(null);
  error = signal('');
  percent = computed(() => {
    const a = this.attempt();
    return a && a.total > 0 ? Math.round((a.score / a.total) * 100) : 0;
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getAttempt(id, this.isAdmin).subscribe({
      next: a => {
        if (a.status === 'IN_PROGRESS') {
          this.router.navigate(['/quiz', a.id]);
          return;
        }
        this.attempt.set(a);
      },
      error: e => this.error.set(e.error?.message ?? 'Could not load this result')
    });
  }
}