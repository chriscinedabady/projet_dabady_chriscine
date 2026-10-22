import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pollution } from '../models/pollution.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PollutionService {
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/pollutions`;

  getPollutions(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(this.apiUrl);
  }

  getPollutionById(id: number | string): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.apiUrl}/${id}`);
  }

  addPollution(pollution: Omit<Pollution, 'id'>): Observable<Pollution> {
    return this.http.post<Pollution>(this.apiUrl, pollution);
  }

  updatePollution(id: number | string, pollution: Pollution): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.apiUrl}/${id}`, pollution);
  }

  deletePollution(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}