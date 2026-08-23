import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should add the bearer token to protected requests', () => {
    localStorage.setItem('access_token', 'token-123');

    http.get('/api/tasks').subscribe();

    const request = httpMock.expectOne('/api/tasks');
    expect(request.request.headers.get('Authorization')).toBe('Bearer token-123');
    request.flush({});
  });

  it('should not add the token to login requests', () => {
    localStorage.setItem('access_token', 'token-123');

    http.post('/auth/login', {}).subscribe();

    const request = httpMock.expectOne('/auth/login');
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({});
  });
});
