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

  private apiUrl = `${environment.apiUrl}/users`;

  /**
   * Envoie une requête POST pour inscrire un nouvel utilisateur.
   * @param userData Les informations saisies dans le formulaire (sans id)
   * @returns Un Observable de l'utilisateur créé (avec id retourné par l'API)
   */
  signUp(userData: SignUpPayload): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }
}