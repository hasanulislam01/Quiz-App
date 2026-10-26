import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../core/admin.service';
import { Category, QuestionDto } from '../core/models';

@Component({
  selector: 'app-admin-questions',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="row" style="margin-top:0">
      <h2 style="margin:0">Questions</h2>
      <span class="spacer"></span>
      <a class="btn" routerLink="/admin/questions/new">Add question</a>
    </div>

    <label>Filter by category</label>
    <select [ngModel]="categoryId" (ngModelChange)="onFilter($event)" name="filter">
      <option [ngValue]="null">All categories</option>
      @for (c of categories(); track c.id) {
        <option [ngValue]="c.id">{{ c.name }}</option>
      }
    </select>

    @if (error()) { <p class="error">{{ error() }}</p> }

    <table style="margin-top:16px">
      <thead><tr><th>Question</th><th>Category</th><th>Correct answer</th><th></th></tr></thead>
      <tbody>
        @for (q of questions(); track q.id) {
          <tr>
            <td>{{ q.text }}</td>
            <td>{{ q.categoryName }}</td>
            <td>{{ correctText(q) }}</td>
            <td>
              <a class="btn small secondary" [routerLink]="['/admin/questions', q.id, 'edit']">Edit</a>
              <button class="btn small danger" (click)="remove(q)">Delete</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class AdminQuestionsComponent {
  private api = inject(AdminService);

  categories = signal<Category[]>([]);
  questions = signal<QuestionDto[]>([]);
  error = signal('');
  categoryId: number | null = null;

  constructor() {
    this.api.categories().subscribe(c => this.categories.set(c));
    this.load();
  }

  onFilter(id: number | null) {
    this.categoryId = id;
    this.load();
  }

  load() {
    this.api.questions(this.categoryId).subscribe(q => this.questions.set(q));
  }

  correctText(q: QuestionDto) {
    return q.options.find(o => o.correct)?.text ?? '';
  }

  remove(q: QuestionDto) {
    if (!confirm('Delete this question?')) return;
    this.error.set('');
    this.api.deleteQuestion(q.id!).subscribe({
      next: () => this.load(),
      error: e => this.error.set(e.error?.message ?? 'Could not delete the question')
    });
  }
}