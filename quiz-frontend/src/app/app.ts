import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a class="brand" routerLink="/">Quiz App</a>
      <div class="links">
        @if (auth.isLoggedIn()) {
          <a routerLink="/home" routerLinkActive="active">Quizzes</a>
          <a routerLink="/my-attempts" routerLinkActive="active">My results</a>
          @if (auth.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="active">Admin</a>
          }
          <span class="muted">{{ auth.user()?.name }}</span>
          <button class="btn small secondary" (click)="auth.logout()">Logout</button>
        } @else {
          <a routerLink="/login">Login</a>
          <a routerLink="/register">Register</a>
        }
      </div>
    </nav>
    <main class="container">
      <router-outlet />
    </main>
  `
})
export class AppComponent {
  auth = inject(AuthService);
}