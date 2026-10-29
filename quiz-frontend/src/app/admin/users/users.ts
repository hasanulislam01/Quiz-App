import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../core/admin.service';
import { AdminUser } from '../../core/models';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  private api = inject(AdminService);
  users = signal<AdminUser[]>([]);

  constructor() {
    this.api.users().subscribe(u => this.users.set(u));
  }
}
