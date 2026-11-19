import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render navigation links', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav.sidebar')?.textContent).toContain('Liste des pollutions');
    expect(compiled.querySelector('nav.sidebar')?.textContent).toContain('Déclarer une pollution');
    expect(compiled.querySelector('nav.sidebar')?.textContent).toContain('Inscription');
  });

  it('should toggle and close the sidebar', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app.sidebarOpen()).toBe(false);

    app.toggleSidebar();
    expect(app.sidebarOpen()).toBe(true);

    app.toggleSidebar();
    expect(app.sidebarOpen()).toBe(false);

    app.toggleSidebar();
    app.closeSidebar();
    expect(app.sidebarOpen()).toBe(false);
  });
});
