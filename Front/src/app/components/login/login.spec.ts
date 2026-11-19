import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  let authServiceMock: {
    login: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn().mockReturnValue(of({ id: 1, username: 'johndoe', email: 'john@example.com' }))
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create with invalid empty form', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm.valid).toBe(false);
  });

  it('should authenticate and redirect to /pollutions on valid submit', () => {
    const navSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    component.loginForm.setValue({
      identifier: 'johndoe',
      password: 'Password123'
    });

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      identifier: 'johndoe',
      password: 'Password123'
    });
    expect(navSpy).toHaveBeenCalledWith('/pollutions');
  });

  it('should display error message on invalid credentials', () => {
    authServiceMock.login.mockReturnValue(
      throwError(() => ({ error: { message: 'Identifiant ou mot de passe incorrect.' } }))
    );

    component.loginForm.setValue({
      identifier: 'johndoe',
      password: 'wrong'
    });

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Identifiant ou mot de passe incorrect.');
  });
});
