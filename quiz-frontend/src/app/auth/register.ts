import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card narrow">
      <h2>Create account</h2>
      <form (ngSubmit)="submit()">
        <label>Name</label>
        <input name="name" [(ngModel)]="name" required>
        <label>Email</label>
        <input name="email" type="email" [(ngModel)]="email" required>
        <label>Password (at least 6 characters)</label>
        <input name="password" type="password" [(ngModel)]="password" required minlength="6">
        @if (error()) { <p class="error">{{ error() }}</p> }
        <div class="row">
          <button class="btn" type="submit" [disabled]="loading()">Register</button>
        </div>
      </form>
      <p class="muted">Already registered? <a routerLink="/login">Login</a></p>
    </div>
  `
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  error = signal('');
  loading = signal(false);

  submit() {
    this.error.set('');
    this.loading.set(true);
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: e => {
        this.error.set(e.error?.message ?? 'Registration failed');
        this.loading.set(false);
      }
    });
  }
}