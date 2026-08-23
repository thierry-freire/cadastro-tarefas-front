import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['login']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not submit an invalid form', () => {
    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
    expect(component.form.controls['username'].touched).toBeTrue();
  });

  it('should login and navigate to tasks', () => {
    authService.login.and.returnValue(of({ accessToken: 'token', tokenType: 'Bearer', expiresIn: 3600 }));
    component.form.setValue({ username: 'thierry', password: 'secret' });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('thierry', 'secret');
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should show the API error and stop loading', () => {
    authService.login.and.returnValue(throwError(() => ({ error: { message: 'Acesso negado' } })));
    component.form.setValue({ username: 'thierry', password: 'secret' });

    component.onSubmit();

    expect(component.errorMessage).toBe('Acesso negado');
    expect(component.loading).toBeFalse();
  });
});
