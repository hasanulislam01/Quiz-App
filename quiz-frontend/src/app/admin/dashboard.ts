import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../core/admin.service';
import { Dashboard } from '../core/models';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    @if (data(); as d) {
      <h2>Dashboard</h2>
      <div class="grid">
        <div class="card"><div class="score">{{ d.users }}</div><p class="muted">Users</p></div>
        <div class="card"><div class="score">{{ d.categories }}</div><p class="muted">Categories</p></div>
        <div class="card"><div class="score">{{ d.questions }}</div><p class="muted">Questions</p></div>
        <div class="card"><div class="score">{{ d.attempts }}</div><p class="muted">Attempts</p></div>
      </div>

      <h3>Questions per category</h3>
      <p class="muted">Each exam needs {{ d.examQuestionCount }} questions in a category.</p>
      <table>
        <thead><tr><th>Category</th><th>Questions</th><th>Status</th></tr></thead>
        <tbody>
          @for (c of d.categoryStats; track c.id) {
            <tr>
              <td>{{ c.name }}</td>
              <td>{{ c.questionCount }}</td>
              <td>
                @if (c.enoughQuestions) { Ready }
                @else { <span class="error">Needs {{ d.examQuestionCount - c.questionCount }} more</span> }
              </td>
            </tr>
          }
        </tbody>
      </table>
    }
  `
})
export class AdminDashboardComponent {
  private api = inject(AdminService);
  data = signal<Dashboard | null>(null);

  constructor() {
    this.api.dashboard().subscribe(d => this.data.set(d));
  }
}