import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuizService } from '../../core/quiz.service';
import { AttemptDetail } from '../../core/models';

@Component({
  selector: 'app-result',
  imports: [RouterLink],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result {
  private api = inject(QuizService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly String = String;

  isAdmin = this.route.snapshot.data['admin'] === true;
  attempt = signal<AttemptDetail | null>(null);
  error = signal('');
  percent = computed(() => {
    const a = this.attempt();
    return a && a.total > 0 ? Math.round((a.score / a.total) * 100) : 0;
  });

  isAnswerCorrect(item: any): boolean {
    return item.options.some(
      (option: any) =>
        option.id === item.selectedOptionId && option.correct
    );
  }
  scrollToAnswerReview(): void {
    document.getElementById('answer-review')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

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
