import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/admin.service';
import { Category, QuestionDto } from '../../core/models';

@Component({
  selector: 'app-questions',
  imports: [RouterLink, FormsModule],
  templateUrl: './questions.html',
  styleUrl: './questions.css',
})
export class Questions {
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
