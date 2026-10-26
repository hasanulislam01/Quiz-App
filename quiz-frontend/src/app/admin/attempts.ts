import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../core/admin.service';
import { AdminUser, AttemptSummary, Category } from '../core/models';

@Component({
  selector: 'app-admin-attempts',
  imports: [FormsModule, RouterLink, DatePipe],
  template: `
    <h2>All attempts</h2>
    <div class="row" style="margin-top:0">
      <select [ngModel]="categoryId" (ngModelChange)="categoryId = $event; load()" name="category">
        <option [ngValue]="null">All categories</option>
        @for (c of categories(); track c.id) { <option [ngValue]="c.id">{{ c.name }}</option> }
      </select>
      <select [ngModel]="userId" (ngModelChange)="userId = $event; load()" name="user">
        <option [ngValue]="null">All users</option>
        @for (u of users(); track u.id) { <option [ngValue]="u.id">{{ u.name }}</option> }
      </select>
    </div>

    <table style="margin-top:16px">
      <thead><tr><th>Date</th><th>User</th><th>Category</th><th>Score</th><th>Status</th><th></th></tr></thead>
      <tbody>
        @for (a of attempts(); track a.id) {
          <tr>
            <td>{{ a.startedAt | date: 'medium' }}</td>
            <td>{{ a.userName }}</td>
            <td>{{ a.categoryName }}</td>
            <td>{{ a.status === 'IN_PROGRESS' ? '-' : a.score + ' / ' + a.total }}</td>
            <td>{{ a.status }}</td>
            <td>
              @if (a.status !== 'IN_PROGRESS') {
                <a [routerLink]="['/admin/attempts', a.id]">View</a>
              }
            </td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class AdminAttemptsComponent {
  private api = inject(AdminService);

  categories = signal<Category[]>([]);
  users = signal<AdminUser[]>([]);
  attempts = signal<AttemptSummary[]>([]);
  categoryId: number | null = null;
  userId: number | null = null;

  constructor() {
    this.api.categories().subscribe(c => this.categories.set(c));
    this.api.users().subscribe(u => this.users.set(u));
    this.load();
  }

  load() {
    this.api.attempts(this.categoryId, this.userId).subscribe(a => this.attempts.set(a));
  }
}