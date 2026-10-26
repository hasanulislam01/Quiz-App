import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuizService } from '../core/quiz.service';
import { AttemptSummary } from '../core/models';

@Component({
  selector: 'app-my-attempts',
  imports: [RouterLink, DatePipe],
  template: `
    <h2>My results</h2>
    @if (attempts().length === 0) {
      <p class="muted">You have not taken any quiz yet.</p>
    } @else {
      <table>
        <thead>
          <tr><th>Date</th><th>Category</th><th>Score</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          @for (a of attempts(); track a.id) {
            <tr>
              <td>{{ a.startedAt | date: 'medium' }}</td>
              <td>{{ a.categoryName }}</td>
              <td>{{ a.status === 'IN_PROGRESS' ? '-' : a.score + ' / ' + a.total }}</td>
              <td>{{ a.status }}</td>
              <td>
                @if (a.status === 'IN_PROGRESS') {
                  <a [routerLink]="['/quiz', a.id]">Resume</a>
                } @else {
                  <a [routerLink]="['/result', a.id]">Review</a>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    }
  `
})
export class MyAttemptsComponent {
  private api = inject(QuizService);
  attempts = signal<AttemptSummary[]>([]);

  constructor() {
    this.api.myAttempts().subscribe(a => this.attempts.set(a));
  }
}