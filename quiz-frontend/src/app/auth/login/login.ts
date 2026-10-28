
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  error = signal('');
  loading = signal(false);
  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update(value => !value);
  }

  submit() {
    if (this.loading()) return;

    this.error.set('');
    this.loading.set(true);

    this.auth.login(this.email, this.password).subscribe({
      next: u => {
        this.router.navigate([
          u.role === 'ADMIN' ? '/admin' : '/home'
        ]);
      },
      error: e => {
        this.error.set(
          e.error?.message ?? 'Login failed. Please try again.'
        );
        this.loading.set(false);
      }
    });
    
  }
}
