import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card narrow">
      <h2>Login</h2>
      <form (ngSubmit)="submit()">
        <label>Email</label>
        <input name="email" type="email" [(ngModel)]="email" required>
        <label>Password</label>
        <input name="password" type="password" [(ngModel)]="password" required>
        @if (error()) { <p class="error">{{ error() }}</p> }
        <div class="row">
          <button class="btn" type="submit" [disabled]="loading()">Login</button>
        </div>
      </form>
      <p class="muted">No account? <a routerLink="/register">Register</a></p>
    </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal('');
  loading = signal(false);

  submit() {
    this.error.set('');
    this.loading.set(true);
    this.auth.login(this.email, this.password).subscribe({
      next: u => this.router.navigate([u.role === 'ADMIN' ? '/admin' : '/home']),
      error: e => {
        this.error.set(e.error?.message ?? 'Login failed');
        this.loading.set(false);
      }
    });
  }
}