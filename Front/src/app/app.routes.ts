import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },

  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./components/login/login').then((m) => m.LoginComponent)
  },

  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup').then((m) => m.SignupComponent)
  },

  {
    path: '',
    canMatch: [authGuard],
    loadChildren: () => import('./routes/pollution.routes').then((m) => m.POLLUTION_ROUTES)
  },

  { path: '**', redirectTo: 'pollutions' }
];
