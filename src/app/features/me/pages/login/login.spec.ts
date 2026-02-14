import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { defer, of } from 'rxjs';
import { LoginComponent } from './login';
import { AuthService } from '../../../../core/auth/auth';
import { ToastService } from '../../../../shared/services/toast/toast';
import { User } from '../../domain/models/user';

describe('LoginComponent', () => {
  let authServiceStub: {
    login: ReturnType<typeof vi.fn>;
    setUser: ReturnType<typeof vi.fn>;
    currentUser: ReturnType<typeof vi.fn>;
    isLoggedIn: ReturnType<typeof vi.fn>;
  };
  let routerStub: { navigate: ReturnType<typeof vi.fn> };
  let toastServiceStub: { show: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceStub = {
      login: vi.fn(),
      setUser: vi.fn(),
      currentUser: vi.fn().mockReturnValue(null),
      isLoggedIn: vi.fn().mockReturnValue(false),
    };
    routerStub = { navigate: vi.fn() };
    toastServiceStub = { show: vi.fn() };

    TestBed.overrideComponent(LoginComponent, {
      set: {
        imports: [],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: AuthService, useValue: authServiceStub },
          { provide: Router, useValue: routerStub },
          { provide: ToastService, useValue: toastServiceStub },
        ],
      },
    });
  });

  it('should have empty form fields by default', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    expect(component.loginForm.value).toEqual({ login: '', password: '' });
  });

  it('should call authService.login on submit with valid credentials', () => {
    const user: User = { id: '1', login: 'admin', password: 'admin', name: 'Admin' };
    authServiceStub.login.mockReturnValue(defer(() => of([user])));

    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    component.loginForm.setValue({ login: 'admin', password: 'admin' });

    component.onSubmit();

    expect(authServiceStub.login).toHaveBeenCalledWith('admin', 'admin');
    expect(authServiceStub.setUser).toHaveBeenCalledWith(user);
    expect(routerStub.navigate).toHaveBeenCalledWith(['/me']);
  });

  it('should show error toast when login fails', () => {
    authServiceStub.login.mockReturnValue(defer(() => of([])));

    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    component.loginForm.setValue({ login: 'wrong', password: 'wrong' });

    component.onSubmit();

    expect(toastServiceStub.show).toHaveBeenCalledWith('Identifiant ou mot de passe incorrect', 'error');
    expect(authServiceStub.setUser).not.toHaveBeenCalled();
  });

  it('should not submit when form is invalid', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    component.onSubmit();

    expect(authServiceStub.login).not.toHaveBeenCalled();
  });
});
