import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento, EventoPageResponse } from '../models/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private readonly apiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  list(page: number = 0, size: number = 10): Observable<EventoPageResponse> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<EventoPageResponse>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`);
  }

  create(evento: Evento): Observable<any> {
    return this.http.post(this.apiUrl, evento);
  }

  update(id: number, evento: Evento): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, evento);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
