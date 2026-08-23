import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TarefaService } from './tarefa.service';
import { AuthService } from './auth.service';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { Tarefa } from '../models/tarefa';

describe('TarefaService', () => {
  let service: TarefaService;
  let httpMock: HttpTestingController;
  const tarefa: Tarefa = {
    id: 7,
    titulo: 'Estudar Angular',
    descricao: 'Revisar testes',
    status: 'PENDENTE',
    dataCriacao: new Date('2026-08-23T10:00:00'),
    dataConclusao: new Date('2026-08-24T10:00:00'),
    responsavel: 'Thierry'
  };

  beforeEach(() => {
    localStorage.setItem('access_token', 'token-123');
    TestBed.configureTestingModule({
      providers: [
        TarefaService,
        AuthService,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TarefaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should list tasks with pagination and filters', () => {
    service.list(2, 5, 'PENDENTE', 'Thierry').subscribe();

    const request = httpMock.expectOne((req) => req.url === 'http://localhost:8080/api/tasks');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('size')).toBe('5');
    expect(request.request.params.get('status')).toBe('PENDENTE');
    expect(request.request.params.get('responsavel')).toBe('Thierry');
    expect(request.request.headers.get('Authorization')).toBe('Bearer token-123');
    request.flush({ content: [], totalElements: 0, totalPages: 0, size: 5, number: 2 });
  });

  it('should create, update, load and delete a task', () => {
    service.create(tarefa).subscribe();
    let request = httpMock.expectOne('http://localhost:8080/api/tasks');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(tarefa);
    request.flush({});

    service.update(7, tarefa).subscribe();
    request = httpMock.expectOne('http://localhost:8080/api/tasks/7');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(tarefa);
    request.flush({});

    service.getById(7).subscribe();
    request = httpMock.expectOne('http://localhost:8080/api/tasks/7');
    expect(request.request.method).toBe('GET');
    request.flush(tarefa);

    service.delete(7).subscribe();
    request = httpMock.expectOne('http://localhost:8080/api/tasks/7');
    expect(request.request.method).toBe('DELETE');
    request.flush({});
  });
});
