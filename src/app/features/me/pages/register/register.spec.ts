import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { defer, of } from 'rxjs';
import { RegisterComponent } from './register';
import { UsersGateway } from '../../domain/gateways/users';
import { AuthService } from '../../../../core/auth/auth';
import { ToastService } from '../../../../shared/services/toast/toast';
import { User } from '../../domain/models/user';

describe('RegisterComponent', () => {
  let usersGatewayStub: { register: ReturnType<typeof vi.fn> };
  let authServiceStub: { setUser: ReturnType<typeof vi.fn> };
  let routerStub: { navigate: ReturnType<typeof vi.fn> };
  let toastServiceStub: { show: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    usersGatewayStub = { register: vi.fn() };
    authServiceStub = { setUser: vi.fn() };
    routerStub = { navigate: vi.fn() };
    toastServiceStub = { show: vi.fn() };

    TestBed.overrideComponent(RegisterComponent, {
      set: {
        imports: [],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: UsersGateway, useValue: usersGatewayStub },
          { provide: AuthService, useValue: authServiceStub },
          { provide: Router, useValue: routerStub },
          { provide: ToastService, useValue: toastServiceStub },
        ],
      },
    });
  });

  it('should have empty form fields by default', () => {
    const fixture = TestBed.createComponent(RegisterComponent);

    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    expect(component.registerForm.value).toEqual({ name: '', login: '', password: '' });
  });

  it('should call usersGateway.register on submit', () => {
    const createdUser: User = { id: '2', name: 'New User', login: 'newuser', password: 'pass123' };
    usersGatewayStub.register.mockReturnValue(defer(() => of(createdUser)));

    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    component.registerForm.setValue({ name: 'New User', login: 'newuser', password: 'pass123' });

    component.onSubmit();

    expect(usersGatewayStub.register).toHaveBeenCalledWith({ name: 'New User', login: 'newuser', password: 'pass123' });
    expect(authServiceStub.setUser).toHaveBeenCalledWith(createdUser);
    expect(toastServiceStub.show).toHaveBeenCalledWith('Compte cree avec succes !', 'success');
    expect(routerStub.navigate).toHaveBeenCalledWith(['/me']);
  });

  it('should not submit when form is invalid', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    component.onSubmit();

    expect(usersGatewayStub.register).not.toHaveBeenCalled();
  });

  it('should not submit when password is too short', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    component.registerForm.setValue({ name: 'User', login: 'user', password: 'ab' });

    component.onSubmit();

    expect(usersGatewayStub.register).not.toHaveBeenCalled();
  });
});
