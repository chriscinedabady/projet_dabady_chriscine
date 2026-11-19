import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { AuthService } from './services/auth';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render Login and Signup links when unauthenticated', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav.sidebar')?.textContent).toContain('Connexion');
    expect(compiled.querySelector('nav.sidebar')?.textContent).toContain('Inscription');
  });

  it('should render Pollution links and Logout button when authenticated', async () => {
    const authService = TestBed.inject(AuthService);
    authService.currentUser.set({ id: 1, username: 'johndoe', email: 'john@example.com' });

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav.sidebar')?.textContent).toContain('Liste des pollutions');
    expect(compiled.querySelector('nav.sidebar')?.textContent).toContain('johndoe');
    expect(compiled.querySelector('.btn-logout')?.textContent).toContain('Se déconnecter');
  });

  it('should toggle and close the sidebar', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app.sidebarOpen()).toBe(false);

    app.toggleSidebar();
    expect(app.sidebarOpen()).toBe(true);

    app.closeSidebar();
    expect(app.sidebarOpen()).toBe(false);
  });
});
