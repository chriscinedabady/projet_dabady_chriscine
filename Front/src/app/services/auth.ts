import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginPayload, SignUpPayload, User } from '../models/user';

const STORAGE_KEY = 'pollution_auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/users`;

  readonly currentUser = signal<User | null>(this.loadStoredUser());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  private loadStoredUser(): User | null {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private setSession(user: User | null): void {
    this.currentUser.set(user);
    try {
      if (typeof localStorage !== 'undefined') {
        if (user) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // Ignore storage errors in restricted environments
    }
  }

  /**
   * Authentifie un utilisateur (POST /api/users/login) et ouvre sa session.
   */
  login(credentials: LoginPayload): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/login`, credentials)
      .pipe(tap((user) => this.setSession(user)));
  }

  /**
   * Ferme la session de l'utilisateur courant.
   */
  logout(): void {
    this.setSession(null);
  }

  /**
   * Récupère la liste des utilisateurs (GET /api/users).
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Envoie une requête POST pour inscrire un nouvel utilisateur (POST /api/users).
   */
  signUp(userData: SignUpPayload): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  /**
   * Supprime un utilisateur par son identifiant (DELETE /api/users/:id).
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
