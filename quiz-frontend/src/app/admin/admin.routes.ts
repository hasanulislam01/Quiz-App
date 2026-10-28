import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.AdminDashboard) },
      { path: 'categories',
        loadComponent: () => import('./categories').then(m => m.AdminCategoriesComponent) },
      { path: 'questions',
        loadComponent: () => import('./questions').then(m => m.AdminQuestionsComponent) },
      { path: 'questions/new',
        loadComponent: () => import('./question-form').then(m => m.QuestionFormComponent) },
      { path: 'questions/:id/edit',
        loadComponent: () => import('./question-form').then(m => m.QuestionFormComponent) },
      { path: 'settings',
        loadComponent: () => import('./settings').then(m => m.AdminSettingsComponent) },
      { path: 'users',
        loadComponent: () => import('./users').then(m => m.AdminUsersComponent) },
      { path: 'attempts',
        loadComponent: () => import('./attempts').then(m => m.AdminAttemptsComponent) },
      // reuses the user's result page, but loads the attempt through the admin endpoint
      { path: 'attempts/:id', data: { admin: true },
        loadComponent: () => import('../user/result').then(m => m.ResultComponent) }
    ]
  }
];