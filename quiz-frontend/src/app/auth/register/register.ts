import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
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

    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: e => {
        this.error.set(
          e.error?.message ?? 'Registration failed. Please try again.'
        );
        this.loading.set(false);
      }
    });
  }
}
