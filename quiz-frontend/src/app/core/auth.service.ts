import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from './api';
import { AuthUser } from './models';

const KEY = 'quiz-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  user = signal<AuthUser | null>(this.read());
  isLoggedIn = computed(() => this.user() !== null);
  isAdmin = computed(() => this.user()?.role === 'ADMIN');

  token(): string | null {
    return this.user()?.token ?? null;
  }

  login(email: string, password: string) {
    return this.http.post<AuthUser>(`${API_URL}/auth/login`, { email, password })
      .pipe(tap(u => this.save(u)));
  }

  register(name: string, email: string, password: string) {
    return this.http.post<AuthUser>(`${API_URL}/auth/register`, { name, email, password })
      .pipe(tap(u => this.save(u)));
  }

  logout() {
    localStorage.removeItem(KEY);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  private save(u: AuthUser) {
    localStorage.setItem(KEY, JSON.stringify(u));
    this.user.set(u);
  }

  private read(): AuthUser | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}