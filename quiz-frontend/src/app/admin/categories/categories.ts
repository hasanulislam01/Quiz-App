
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/admin.service';
import { Category } from '../../core/models';

@Component({
  selector: 'app-categories',
  imports: [FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private api = inject(AdminService);

  categories = signal<Category[]>([]);
  editingId = signal<number | null>(null);
  error = signal('');
  successMessage = signal('');

  name = '';
  description = '';

  dialogOpen = signal(false);
  deleteDialogOpen = signal(false);
  categoryToDelete = signal<Category | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.api.categories().subscribe({
      next: categories => this.categories.set(categories),
      error: e => {
        this.error.set(
          e.error?.message ?? 'Could not load categories'
        );
      },
    });
  }

  openAddDialog(): void {
    this.reset();
    this.error.set('');
    this.dialogOpen.set(true);
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
    this.reset();
    this.error.set('');
  }

  edit(c: Category): void {
    this.editingId.set(c.id);
    this.name = c.name;
    this.description = c.description ?? '';
    this.error.set('');
    this.dialogOpen.set(true);
  }

  reset(): void {
    this.editingId.set(null);
    this.name = '';
    this.description = '';
  }

  save(): void {
    this.error.set('');
    this.successMessage.set('');

    const body = {
      name: this.name,
      description: this.description,
    };

    const id = this.editingId();
    const isEditing = id !== null;

    const request = isEditing
      ? this.api.updateCategory(id!, body)
      : this.api.createCategory(body);

    request.subscribe({
      next: () => {
        this.successMessage.set(
          isEditing
            ? 'Category updated successfully!'
            : 'Category added successfully!'
        );

        this.closeDialog();
        this.load();
      },
      error: e => {
        this.error.set(
          e.error?.message ?? 'Could not save the category'
        );
      },
    });
  }

  openDeleteDialog(category: Category): void {
    this.categoryToDelete.set(category);
    this.error.set('');
    this.deleteDialogOpen.set(true);
  }

  closeDeleteDialog(): void {
    this.deleteDialogOpen.set(false);
    this.categoryToDelete.set(null);
  }

  confirmDelete(): void {
    console.log("test");
    
    const category = this.categoryToDelete();

    if (!category) {
      return;
    }

    this.error.set('');
    this.successMessage.set('');

    this.api.deleteCategory(category.id).subscribe({
      next: () => {
        this.successMessage.set(
          `Category "${category.name}" deleted successfully!`
        );

        this.closeDeleteDialog();
        this.load();
      },
      error: e => {
        this.error.set(
          e.error?.message ?? 'Could not delete the category'
        );
        this.closeDeleteDialog();
      },
    });
  }
}
