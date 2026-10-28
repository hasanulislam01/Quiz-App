import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuizService } from '../../core/quiz.service';
import { AttemptSummary } from '../../core/models';

@Component({
  selector: 'app-my-attempts',
  imports: [RouterLink, DatePipe],
  templateUrl: './my-attempts.html',
  styleUrl: './my-attempts.css',
})
export class MyAttempts {
  private api = inject(QuizService);
  attempts = signal<AttemptSummary[]>([]);

  constructor() {
    this.api.myAttempts().subscribe(a => this.attempts.set(a));
  }

  getCompletedCount(): number {
  return this.attempts().filter(
    a => a.status !== 'IN_PROGRESS'
  ).length;
  }

  getInProgressCount(): number {
    return this.attempts().filter(
      a => a.status === 'IN_PROGRESS'
    ).length;
  }
}
