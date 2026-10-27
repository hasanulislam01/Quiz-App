// import { Component, inject, signal } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { AuthService } from '../core/auth.service';

// @Component({
//   selector: 'app-login',
//   imports: [FormsModule, RouterLink],
//   template: `
//     <div class="card narrow">
//       <h2>Login</h2>
//       <form (ngSubmit)="submit()">
//         <label>Email</label>
//         <input name="email" type="email" [(ngModel)]="email" required>
//         <label>Password</label>
//         <input name="password" type="password" [(ngModel)]="password" required>
//         @if (error()) { <p class="error">{{ error() }}</p> }
//         <div class="row">
//           <button class="btn" type="submit" [disabled]="loading()">Login</button>
//         </div>
//       </form>
//       <p class="muted">No account? <a routerLink="/register">Register</a></p>
//     </div>
//   `
// })
// export class LoginComponent {
//   private auth = inject(AuthService);
//   private router = inject(Router);

//   email = '';
//   password = '';
//   error = signal('');
//   loading = signal(false);

//   submit() {
//     this.error.set('');
//     this.loading.set(true);
//     this.auth.login(this.email, this.password).subscribe({
//       next: u => this.router.navigate([u.role === 'ADMIN' ? '/admin' : '/home']),
//       error: e => {
//         this.error.set(e.error?.message ?? 'Login failed');
//         this.loading.set(false);
//       }
//     });
//   }
// }





import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <main class="login-page">
      <div class="background-shape shape-one"></div>
      <div class="background-shape shape-two"></div>

      <section class="login-wrapper">
        <div class="brand-section">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3L20 7V12C20 17 16.5 20 12 22C7.5 20 4 17 4 12V7L12 3Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
              <path
                d="M8.5 12L10.8 14.3L15.8 9.3"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <h1>Welcome back<span>.</span></h1>
          <p>Sign in to continue to your account.</p>
        </div>

        <div class="login-card">
          <div class="card-heading">
            <h2>Sign in</h2>
            <p>Enter your credentials below to get started.</p>
          </div>

          <form (ngSubmit)="submit()" #loginForm="ngForm">
            <div class="form-group">
              <label for="email">Email address</label>

              <div class="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="3"
                    stroke="currentColor"
                    stroke-width="1.7"
                  />
                  <path
                    d="M4 7L12 13L20 7"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  [(ngModel)]="email"
                  required
                  email
                  autocomplete="email"
                />
              </div>
            </div>

            <div class="form-group">
              <div class="label-row">
                <label for="password">Password</label>
              </div>

              <div class="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="1.7"
                  />
                  <path
                    d="M8 10V7A4 4 0 0 1 16 7V10"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  />
                  <circle cx="12" cy="15" r="1.2" fill="currentColor"/>
                </svg>

                <input
                  id="password"
                  name="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  placeholder="Enter your password"
                  [(ngModel)]="password"
                  required
                  autocomplete="current-password"
                />

                <button
                  class="password-toggle"
                  type="button"
                  (click)="togglePassword()"
                  [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                >
                  @if (showPassword()) {
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 3L21 21M10.6 10.6A2 2 0 0 0 13.4 13.4"
                        stroke="currentColor"
                        stroke-width="1.7"
                        stroke-linecap="round"
                      />
                      <path
                        d="M9.9 5.2A10.8 10.8 0 0 1 12 5C17 5 20 12 20 12A15 15 0 0 1 17 16"
                        stroke="currentColor"
                        stroke-width="1.7"
                        stroke-linecap="round"
                      />
                      <path
                        d="M6.2 6.2C4.1 7.7 3 12 3 12S6 19 12 19C13.4 19 14.6 18.6 15.7 17.9"
                        stroke="currentColor"
                        stroke-width="1.7"
                        stroke-linecap="round"
                      />
                    </svg>
                  } @else {
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M2.5 12S6 5 12 5S21.5 12 21.5 12S18 19 12 19S2.5 12 2.5 12Z"
                        stroke="currentColor"
                        stroke-width="1.7"
                        stroke-linejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        stroke-width="1.7"
                      />
                    </svg>
                  }
                </button>
              </div>
            </div>

            @if (error()) {
              <div class="error-message" role="alert">
                <span>!</span>
                {{ error() }}
              </div>
            }

            <button
              class="submit-button"
              type="submit"
              [disabled]="loading() || loginForm.invalid"
            >
              @if (loading()) {
                <span class="spinner"></span>
                Signing in...
              } @else {
                Sign in to your account
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19M12 5L19 12L12 19"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
            </button>
          </form>

          <div class="register-section">
            <span>Don't have an account?</span>
            <a routerLink="/register">Create an account</a>
          </div>
        </div>

        <footer class="login-footer">
          <span class="footer-dot"></span>
          Secure authentication
          <span class="footer-divider">·</span>
          Your account, protected
        </footer>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      font-family: Inter, "Segoe UI", Arial, sans-serif;
      color: #172033;
    }

    * {
      box-sizing: border-box;
    }

    .login-page {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      width: 100%;
      min-height: 100vh;
      min-height: 100dvh;

      padding: 48px 20px;
      overflow: hidden;

      background:
        radial-gradient(
          ellipse at 10% 10%,
          #e2eaff 0%,
          transparent 40%
        ),
        radial-gradient(
          ellipse at 90% 90%,
          #d8f5f0 0%,
          transparent 38%
        ),
        #f6f8fc;
    }

    .background-shape {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(1px);
    }

    .shape-one {
      width: 300px;
      height: 300px;
      top: -150px;
      right: -80px;
      background: linear-gradient(135deg, #c7d7ff, #e3e9ff);
      opacity: 0.55;
    }

    .shape-two {
      width: 240px;
      height: 240px;
      bottom: -110px;
      left: -70px;
      background: linear-gradient(135deg, #c5f2e8, #dcefff);
      opacity: 0.65;
    }

    .login-wrapper {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
      margin: auto;
    }

    .brand-section {
      text-align: center;
      margin-bottom: 30px;
    }

    .brand-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 58px;
      height: 58px;
      margin: 0 auto 20px;
      border-radius: 18px;
      color: white;
      background: linear-gradient(145deg, #526df4, #3448c5);
      box-shadow: 0 10px 24px #526df440;
    }

    .brand-icon svg {
      width: 30px;
      height: 30px;
    }

    .brand-section h1 {
      margin: 0 0 10px;
      font-size: clamp(29px, 5vw, 36px);
      font-weight: 750;
      letter-spacing: -1.4px;
      color: #18233b;
    }

    .brand-section h1 span {
      color: #526df4;
    }

    .brand-section > p {
      margin: 0;
      color: #778197;
      font-size: 14px;
    }

    .login-card {
      padding: 34px;
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid #ffffff;
      border-radius: 22px;
      box-shadow:
        0 24px 65px rgba(33, 48, 85, 0.09),
        0 3px 10px rgba(33, 48, 85, 0.03);
    }

    .card-heading {
      margin-bottom: 28px;
    }

    .card-heading h2 {
      margin: 0 0 8px;
      font-size: 23px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #202b42;
    }

    .card-heading p {
      margin: 0;
      color: #8992a5;
      font-size: 13px;
      line-height: 1.6;
    }

    .form-group {
      margin-bottom: 22px;
    }

    .form-group label {
      display: block;
      margin-bottom: 9px;
      font-size: 13px;
      font-weight: 650;
      color: #364158;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      min-height: 52px;
      padding: 0 14px;
      gap: 12px;
      background: #f9faff;
      border: 1px solid #e5e9f2;
      border-radius: 11px;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    }

    .input-wrapper:focus-within {
      background: #ffffff;
      border-color: #6278f5;
      box-shadow: 0 0 0 4px rgba(82, 109, 244, 0.10);
    }

    .input-wrapper > svg {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      color: #929bb0;
    }

    .input-wrapper input {
      width: 100%;
      min-width: 0;
      padding: 14px 0;
      border: none;
      outline: none;
      background: transparent;
      color: #202b42;
      font: inherit;
      font-size: 13px;
    }

    .input-wrapper input::placeholder {
      color: #a6adbc;
    }

    .password-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      padding: 4px;
      border: 0;
      background: transparent;
      color: #929bb0;
      cursor: pointer;
    }

    .password-toggle:hover {
      color: #526df4;
    }

    .password-toggle svg {
      width: 20px;
      height: 20px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 9px;
      margin: 0 0 18px;
      padding: 12px;
      border: 1px solid #ffd7d7;
      border-radius: 9px;
      background: #fff4f4;
      color: #c93636;
      font-size: 13px;
      overflow-wrap: anywhere;
    }

    .error-message span {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 19px;
      height: 19px;
      border-radius: 50%;
      background: #ffe1e1;
      font-weight: 800;
    }

    .submit-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      min-height: 52px;
      margin-top: 8px;
      padding: 14px 18px;
      border: none;
      border-radius: 11px;
      background: linear-gradient(105deg, #536df4, #4355d8);
      box-shadow: 0 7px 16px rgba(76, 94, 224, 0.23);
      color: white;
      font: inherit;
      font-size: 14px;
      font-weight: 650;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    }

    .submit-button svg {
      width: 19px;
      height: 19px;
      transition: transform 0.2s;
    }

    .submit-button:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 22px rgba(76, 94, 224, 0.30);
    }

    .submit-button:not(:disabled):hover svg {
      transform: translateX(3px);
    }

    .submit-button:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      box-shadow: none;
    }

    .spinner {
      width: 17px;
      height: 17px;
      border: 2px solid #ffffff70;
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .register-section {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 5px;
      margin-top: 25px;
      padding-top: 23px;
      border-top: 1px solid #edf0f6;
      font-size: 12px;
      color: #8992a5;
    }

    .register-section a {
      color: #4b61e7;
      font-weight: 700;
      text-decoration: none;
    }

    .register-section a:hover {
      text-decoration: underline;
    }

    .login-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 26px;
      color: #929bad;
      font-size: 11px;
    }

    .footer-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #36b98c;
      box-shadow: 0 0 0 3px #36b98c20;
    }

    .footer-divider {
      color: #c2c8d4;
    }

    :host {
      display: block;
      min-height: 100vh;
      min-height: 100dvh;
    }

    * {
      box-sizing: border-box;
    }

    @media (max-width: 480px) {
      .login-page {
        padding: 32px 16px;
      }

      .brand-section {
        margin-bottom: 24px;
      }

      .brand-icon {
        width: 52px;
        height: 52px;
        border-radius: 15px;
        margin-bottom: 16px;
      }

      .login-card {
        padding: 26px 21px;
        border-radius: 18px;
      }

      .card-heading {
        margin-bottom: 24px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  `]
})
export class LoginComponent {
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
