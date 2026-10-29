import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.AdminDashboard) },
      { path: 'categories',
        loadComponent: () => import('./categories/categories').then(m => m.Categories) },
      { path: 'questions',
        loadComponent: () => import('./questions/questions').then(m => m.Questions) },
      { path: 'questions/new',
        loadComponent: () => import('./question-form/question-form').then(m => m.QuestionForm) },
      { path: 'questions/:id/edit',
        loadComponent: () => import('./question-form/question-form').then(m => m.QuestionForm) },
      { path: 'settings',
        loadComponent: () => import('./exam-settings/exam-settings').then(m => m.ExamSettings) },
      { path: 'users',
        loadComponent: () => import('./users/users').then(m => m.Users) },
      { path: 'attempts',
        loadComponent: () => import('./attempts/attempts').then(m => m.Attempts) },
      // reuses the user's result page, but loads the attempt through the admin endpoint
      { path: 'attempts/:id', data: { admin: true },
        loadComponent: () => import('../user/result').then(m => m.ResultComponent) }
    ]
  }
];