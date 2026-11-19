import { Routes } from '@angular/router';

export const POLLUTION_ROUTES: Routes = [
  {
    path: 'pollutions',
    loadComponent: () =>
      import('../components/pollution-list/pollution-list').then((m) => m.PollutionListComponent)
  },
  {
    path: 'pollutions/:id',
    loadComponent: () =>
      import('../components/pollution-detail/pollution-detail').then(
        (m) => m.PollutionDetailComponent
      )
  },
  {
    path: 'nouvelle-pollution',
    loadComponent: () =>
      import('../components/pollution-form/pollution-form').then((m) => m.PollutionForm)
  },
  {
    path: 'modifier-pollution/:id',
    loadComponent: () =>
      import('../components/pollution-form/pollution-form').then((m) => m.PollutionForm)
  }
];
