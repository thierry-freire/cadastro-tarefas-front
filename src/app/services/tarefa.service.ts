import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa, TarefaPageResponse } from '../models/tarefa';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private readonly apiUrl = this.getApiUrl();

  constructor(private http: HttpClient) {}

  private getApiUrl(): string {
    const envApiUrl = (window as any)?.__ENV__?.API_URL;
    return envApiUrl || 'http://localhost:8080/api/events';
  }

  list(page: number = 0, size: number = 10): Observable<TarefaPageResponse> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<TarefaPageResponse>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Tarefa> {
    return this.http.get<Tarefa>(`${this.apiUrl}/${id}`);
  }

  create(tarefa: Tarefa): Observable<any> {
    return this.http.post(this.apiUrl, tarefa);
  }

  update(id: number, tarefa: Tarefa): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tarefa);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
