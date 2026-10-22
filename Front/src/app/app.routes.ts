import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },

  {
    path: 'pollutions',
    loadComponent: () => import('./components/pollution-list/pollution-list').then(m => m.PollutionListComponent)
  },

  {
    path: 'pollutions/:id',
    loadComponent: () => import('./components/pollution-detail/pollution-detail').then(m => m.PollutionDetailComponent)
  },

  {
    path: 'nouvelle-pollution',
    loadComponent: () => import('./components/pollution-form/pollution-form').then(m => m.PollutionForm)
  },

  // URL "/signup"  →  page d'inscription (du TP précédent)
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup').then(m => m.SignupComponent)
  }
];
