import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth';
import { SignUpPayload, User } from '../models/user';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/users`;

  const mockUser: User = {
    id: 1,
    username: 'johndoe',
    email: 'john@example.com'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users list (GET /api/users)', () => {
    service.getUsers().subscribe((users) => {
      expect(users).toEqual([mockUser]);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);
  });

  it('should register a new user (POST /api/users)', () => {
    const payload: SignUpPayload = {
      username: 'johndoe',
      email: 'john@example.com',
      password: 'Password123'
    };

    service.signUp(payload).subscribe((created) => {
      expect(created).toEqual(mockUser);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockUser);
  });

  it('should delete a user (DELETE /api/users/:id)', () => {
    service.deleteUser(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
