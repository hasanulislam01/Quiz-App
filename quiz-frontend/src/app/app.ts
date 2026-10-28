import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-wrapper">
      <nav class="navbar">
      <a class="brand" routerLink="/" class="footer-brand"><img src="images/logo.png" alt="System Logo" /> Job Preparation Helper</a>
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
    <footer class="footer">
      <div class="footer-content">
        <a routerLink="/" class="footer-brand">
          <img src="images/logo.png" alt="System Logo" />
          <span>Job Preparation Helper</span>
        </a>
        <p>This system is design and develop by Hasanul Islam</p>

        <p>
          &copy; {{ currentYear }} Job Preparation Helper. All rights reserved.
        </p>
      </div>
    </footer>
    </div>
  `
})
export class AppComponent {
  auth = inject(AuthService);
  currentYear = new Date().getFullYear();
}