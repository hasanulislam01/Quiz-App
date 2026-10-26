import { Routes } from '@angular/router';
import { authGuard } from './core/guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'login', loadComponent: () => import('./auth/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register').then(m => m.RegisterComponent) },
  { path: 'home', canActivate: [authGuard],
    loadComponent: () => import('./user/home').then(m => m.HomeComponent) },
  { path: 'quiz/:id', canActivate: [authGuard],
    loadComponent: () => import('./user/quiz').then(m => m.QuizComponent) },
  { path: 'result/:id', canActivate: [authGuard],
    loadComponent: () => import('./user/result').then(m => m.ResultComponent) },
  { path: 'my-attempts', canActivate: [authGuard],
    loadComponent: () => import('./user/my-attempts').then(m => m.MyAttemptsComponent) },
  { path: '**', redirectTo: 'home' }
];