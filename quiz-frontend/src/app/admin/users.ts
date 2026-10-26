import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../core/admin.service';
import { AdminUser } from '../core/models';

@Component({
  selector: 'app-admin-users',
  template: `
    <h2>Users</h2>
    <table>
      <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
      <tbody>
        @for (u of users(); track u.id) {
          <tr><td>{{ u.name }}</td><td>{{ u.email }}</td><td>{{ u.role }}</td></tr>
        }
      </tbody>
    </table>
  `
})
export class AdminUsersComponent {
  private api = inject(AdminService);
  users = signal<AdminUser[]>([]);

  constructor() {
    this.api.users().subscribe(u => this.users.set(u));
  }
}