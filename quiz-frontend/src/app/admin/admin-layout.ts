import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-tabs">
      <a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a>
      <a routerLink="/admin/categories" routerLinkActive="active">Categories</a>
      <a routerLink="/admin/questions" routerLinkActive="active">Questions</a>
      <a routerLink="/admin/settings" routerLinkActive="active">Exam settings</a>
      <a routerLink="/admin/users" routerLinkActive="active">Users</a>
      <a routerLink="/admin/attempts" routerLinkActive="active">Attempts</a>
    </div>
    <router-outlet />
  `
})
export class AdminLayoutComponent { }