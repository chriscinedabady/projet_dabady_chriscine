import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SignupComponent } from './signup';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let isAuthenticatedSignal = signal(false);

  const mockUsers: User[] = [
    { id: 1, username: 'johndoe', email: 'john@example.com' }
  ];

  let authServiceMock: {
    isAuthenticated: typeof isAuthenticatedSignal;
    getUsers: ReturnType<typeof vi.fn>;
    signUp: ReturnType<typeof vi.fn>;
    deleteUser: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    isAuthenticatedSignal = signal(false);
    authServiceMock = {
      isAuthenticated: isAuthenticatedSignal,
      getUsers: vi.fn().mockReturnValue(of(mockUsers)),
      signUp: vi.fn().mockReturnValue(of({ id: 2, username: 'alice', email: 'alice@example.com' })),
      deleteUser: vi.fn().mockReturnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should not load or display users list when unauthenticated', () => {
    expect(component).toBeTruthy();
    expect(authServiceMock.getUsers).not.toHaveBeenCalled();
    expect(component.users().length).toBe(0);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.users-list-section')).toBeNull();
  });

  it('should load and display users list when authenticated', async () => {
    isAuthenticatedSignal.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(authServiceMock.getUsers).toHaveBeenCalled();
    expect(component.users().length).toBe(1);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.users-list-section')).not.toBeNull();
  });

  it('should call signUp and display success message on valid submit', () => {
    const fakeForm = {
      invalid: false,
      resetForm: vi.fn()
    } as unknown as NgForm;

    component.formData = {
      username: 'alice',
      email: 'alice@example.com',
      password: 'Password123'
    };

    component.onSubmit(fakeForm);

    expect(authServiceMock.signUp).toHaveBeenCalledWith({
      username: 'alice',
      email: 'alice@example.com',
      password: 'Password123'
    });
    expect(component.isLoading()).toBe(false);
    expect(component.successMessage()).toContain('Bienvenue alice');
    expect(fakeForm.resetForm).toHaveBeenCalled();
  });

  it('should set errorMessage when signUp fails', () => {
    authServiceMock.signUp.mockReturnValue(
      throwError(() => ({ error: { message: 'Ce nom d’utilisateur est déjà pris.' } }))
    );

    const fakeForm = {
      invalid: false,
      resetForm: vi.fn()
    } as unknown as NgForm;

    component.onSubmit(fakeForm);

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Ce nom d’utilisateur est déjà pris.');
  });

  it('should block deleteUser when unauthenticated and allow it when authenticated', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    // Non connecté : bloqué
    component.onDeleteUser(1);
    expect(authServiceMock.deleteUser).not.toHaveBeenCalled();

    // Connecté : autorisé
    isAuthenticatedSignal.set(true);
    fixture.detectChanges();
    component.onDeleteUser(1);
    expect(authServiceMock.deleteUser).toHaveBeenCalledWith(1);
    expect(component.users().length).toBe(0);
  });
});
