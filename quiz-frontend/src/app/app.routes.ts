import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/guards';

export const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '', pathMatch: 'full',
  loadComponent: () => import('./pages/landing/landing').then(m => m.Landing) },
  // { path: 'login', loadComponent: () => import('./auth/login').then(m => m.LoginComponent) },
  { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.Login)},
  { path: 'register', loadComponent: () => import('./auth/register/register').then(m => m.Register) },
  { path: 'home', canActivate: [authGuard],
    loadComponent: () => import('./user/home').then(m => m.HomeComponent) },
  { path: 'quiz/:id', canActivate: [authGuard],
    loadComponent: () => import('./user/quiz').then(m => m.QuizComponent) },
  { path: 'result/:id', canActivate: [authGuard],
    loadComponent: () => import('./user/result/result').then(m => m.Result) },
  { path: 'my-attempts', canActivate: [authGuard],
    loadComponent: () => import('./user/my-attempts/my-attempts').then(m => m.MyAttempts) },
  { path: 'admin', canActivate: [adminGuard],
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES) },
  { path: 'practice', canActivate: [authGuard],
    loadComponent: () => import('./user/practice/practice').then(m => m.Practice) },
  { path: 'profile', canActivate: [authGuard],
    loadComponent: () => import('./user/profile/profile').then(m => m.Profile) },
  { path: '**', redirectTo: 'home' }
];