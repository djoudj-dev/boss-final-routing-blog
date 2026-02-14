import { Routes } from '@angular/router';
import { isLoggedInGuard } from '../../core/guards/is-logged-in';

export const ME_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    canMatch: [isLoggedInGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
