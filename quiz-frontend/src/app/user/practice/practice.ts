
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../core/quiz.service';
import { Category, PracticePage } from '../../core/models';

interface PracticeProgress {
  categoryId: number | null;
  page: number;
  search: string;
  revealed: number[];
  showAll: boolean;
}

@Component({
  selector: 'app-practice',
  imports: [FormsModule],
  templateUrl: './practice.html',
  styleUrl: './practice.css',
})
export class Practice {
  private api = inject(QuizService);

  private readonly storageKey = 'job-preparation-progress';

  pageSize = 10;
  currentPage = 0;

  categories = signal<Category[]>([]);
  data = signal<PracticePage | null>(null);
  revealed = signal<Set<number>>(new Set());
  showAll = signal(false);
  error = signal('');

  categoryId: number | null = null;
  search = '';

  constructor() {
    // Restore previous progress
    this.restoreProgress();

    // Load categories
    this.api.categories().subscribe(c => this.categories.set(c));

    // Continue from previous page
    if (this.categoryId !== null) {
      this.load(this.currentPage);
    }
  }

  // Restore saved progress
  private restoreProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);

      if (!saved) return;

      const progress: PracticeProgress = JSON.parse(saved);

      this.categoryId = progress.categoryId;
      this.currentPage = Math.max(0, progress.page || 0);
      this.search = progress.search || '';
      this.revealed.set(new Set(progress.revealed || []));
      this.showAll.set(progress.showAll || false);

    } catch (error) {
      console.error('Could not restore preparation progress:', error);
    }
  }

  // Save current progress
  private saveProgress() {
    const progress: PracticeProgress = {
      categoryId: this.categoryId,
      page: this.currentPage,
      search: this.search,
      revealed: Array.from(this.revealed()),
      showAll: this.showAll()
    };

    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(progress)
      );
    } catch (error) {
      console.error('Could not save preparation progress:', error);
    }
  }

  // Category selection
  onCategory(id: number | null) {
    if (this.categoryId !== id) {
      this.revealed.set(new Set());
      this.showAll.set(false);
    }

    this.categoryId = id;
    this.currentPage = 0;
    this.load(0);
  }

  // Load questions
  load(page: number) {
    if (this.categoryId === null) return;

    this.error.set('');

    this.api.practice(
      this.categoryId,
      this.search,
      page,
      this.pageSize
    ).subscribe({
      next: d => {
        this.data.set(d);
        this.currentPage = d.page;

        // Save progress after successful loading
        this.saveProgress();

        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: e => {
        this.error.set(
          e.error?.message ?? 'Could not load the questions'
        );
      }
    });
  }

  // Check whether answer is visible
  isShown(id: number) {
    return this.showAll() || this.revealed().has(id);
  }

  // Show or hide individual answer
  toggle(id: number) {
    this.revealed.update(s => {
      const next = new Set(s);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });

    this.saveProgress();
  }

  // Show or hide all answers
  toggleAll() {
    this.showAll.update(v => !v);
    this.saveProgress();
  }
}
