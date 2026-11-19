import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { SignupComponent } from './signup';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  const mockUsers: User[] = [
    { id: 1, username: 'johndoe', email: 'john@example.com' }
  ];

  let authServiceMock: {
    getUsers: ReturnType<typeof vi.fn>;
    signUp: ReturnType<typeof vi.fn>;
    deleteUser: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authServiceMock = {
      getUsers: vi.fn().mockReturnValue(of(mockUsers)),
      signUp: vi.fn().mockReturnValue(of({ id: 2, username: 'alice', email: 'alice@example.com' })),
      deleteUser: vi.fn().mockReturnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and load users on init', () => {
    expect(component).toBeTruthy();
    expect(authServiceMock.getUsers).toHaveBeenCalled();
    expect(component.users().length).toBe(1);
    expect(component.users()[0].username).toBe('johndoe');
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

  it('should delete user when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.onDeleteUser(1);

    expect(authServiceMock.deleteUser).toHaveBeenCalledWith(1);
    expect(component.users().length).toBe(0);
  });
});
