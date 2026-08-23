import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { authInterceptor } from '../interceptors/auth.interceptor';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should authenticate and store the access token', () => {
    service.login('thierry', 'secret').subscribe(response => {
      expect(response.accessToken).toBe('token-123');
      expect(service.token).toBe('token-123');
    });

    const request = httpMock.expectOne('http://localhost:8080/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'thierry', password: 'secret' });
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({ accessToken: 'token-123', tokenType: 'Bearer', expiresIn: 3600 });
  });

  it('should remove the token on logout', () => {
    localStorage.setItem('access_token', 'token-123');

    service.logout();

    expect(service.token).toBeNull();
  });
});
