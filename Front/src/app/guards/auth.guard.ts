import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Protège les routes nécessitant une authentification.
 * Redirige vers /login en conservant l'URL demandée dans returnUrl.
 */
export const authGuard: CanMatchFn = (_route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  const returnUrl = '/' + segments.map((s) => s.path).join('/');
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl }
  });
};

/**
 * Empêche un utilisateur déjà connecté d'accéder à la page /login
 * en le redirigeant vers /pollutions.
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/pollutions']);
  }

  return true;
};
