import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../core/admin.service';
import { Category } from '../core/models';

@Component({
  selector: 'app-admin-categories',
  imports: [FormsModule],
  template: `
    <h2>Categories</h2>

    <div class="card">
      <h3 style="margin-top:0">{{ editingId() === null ? 'Add category' : 'Edit category' }}</h3>
      <form (ngSubmit)="save()">
        <label>Name</label>
        <input name="name" [(ngModel)]="name" required>
        <label>Description</label>
        <input name="description" [(ngModel)]="description">
        @if (error()) { <p class="error">{{ error() }}</p> }
        <div class="row">
          <button class="btn" type="submit">Save</button>
          @if (editingId() !== null) {
            <button class="btn secondary" type="button" (click)="reset()">Cancel</button>
          }
        </div>
      </form>
    </div>

    <table>
      <thead><tr><th>Name</th><th>Description</th><th>Questions</th><th></th></tr></thead>
      <tbody>
        @for (c of categories(); track c.id) {
          <tr>
            <td>{{ c.name }}</td>
            <td>{{ c.description }}</td>
            <td>{{ c.questionCount }}</td>
            <td>
              <button class="btn small secondary" (click)="edit(c)">Edit</button>
              <button class="btn small danger" (click)="remove(c)">Delete</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class AdminCategoriesComponent {
  private api = inject(AdminService);

  categories = signal<Category[]>([]);
  editingId = signal<number | null>(null);
  error = signal('');
  name = '';
  description = '';

  constructor() {
    this.load();
  }

  load() {
    this.api.categories().subscribe(c => this.categories.set(c));
  }

  edit(c: Category) {
    this.editingId.set(c.id);
    this.name = c.name;
    this.description = c.description ?? '';
  }

  reset() {
    this.editingId.set(null);
    this.name = '';
    this.description = '';
  }

  save() {
    this.error.set('');
    const body = { name: this.name, description: this.description };
    const id = this.editingId();
    const request = id === null ? this.api.createCategory(body) : this.api.updateCategory(id, body);
    request.subscribe({
      next: () => { this.reset(); this.load(); },
      error: e => this.error.set(e.error?.message ?? 'Could not save the category')
    });
  }

  remove(c: Category) {
    if (!confirm(`Delete the category ${c.name}?`)) return;
    this.error.set('');
    this.api.deleteCategory(c.id).subscribe({
      next: () => this.load(),
      error: e => this.error.set(e.error?.message ?? 'Could not delete the category')
    });
  }
}