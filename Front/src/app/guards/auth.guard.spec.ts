import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import { signal } from '@angular/core';
import { authGuard, guestGuard } from './auth.guard';
import { AuthService } from '../services/auth';

describe('authGuard & guestGuard', () => {
  let isAuthenticatedSignal = signal(false);

  beforeEach(() => {
    isAuthenticatedSignal = signal(false);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            isAuthenticated: isAuthenticatedSignal
          }
        }
      ]
    });
  });

  it('authGuard (CanMatchFn) should allow matching when user is authenticated', () => {
    isAuthenticatedSignal.set(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as Route, [new UrlSegment('pollutions', {})])
    );

    expect(result).toBe(true);
  });

  it('authGuard (CanMatchFn) should redirect to /login with returnUrl when user is not authenticated', () => {
    isAuthenticatedSignal.set(false);
    const router = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as Route, [new UrlSegment('nouvelle-pollution', {})])
    ) as UrlTree;

    expect(router.serializeUrl(result)).toBe('/login?returnUrl=%2Fnouvelle-pollution');
  });

  it('guestGuard should allow access to /login when user is not authenticated', () => {
    isAuthenticatedSignal.set(false);

    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as ActivatedRouteSnapshot, { url: '/login' } as RouterStateSnapshot)
    );

    expect(result).toBe(true);
  });

  it('guestGuard should redirect to /pollutions when user is already authenticated', () => {
    isAuthenticatedSignal.set(true);
    const router = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as ActivatedRouteSnapshot, { url: '/login' } as RouterStateSnapshot)
    ) as UrlTree;

    expect(router.serializeUrl(result)).toBe('/pollutions');
  });
});
