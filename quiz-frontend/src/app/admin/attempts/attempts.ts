import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/admin.service';
import { AdminUser, AttemptSummary, Category } from '../../core/models';

@Component({
  selector: 'app-attempts',
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './attempts.html',
  styleUrl: './attempts.css',
})
export class Attempts {
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
