import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SignUpPayload, User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/api/users`;

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
  deleteUser(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
