import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { defer, of } from 'rxjs';
import { AuthService } from './auth';
import { UsersGateway } from '../../features/me/domain/gateways/users';
import { User } from '../../features/me/domain/models/user';

describe('AuthService', () => {
  let authService: AuthService;
  let usersGatewayStub: { login: ReturnType<typeof vi.fn> };
  let routerStub: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    usersGatewayStub = {
      login: vi.fn(),
    };

    routerStub = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: UsersGateway, useValue: usersGatewayStub },
        { provide: Router, useValue: routerStub },
      ],
    });

    authService = TestBed.inject(AuthService);
  });

  describe('login', () => {
    it('should delegate to usersGateway.login', () => {
      const expectedUsers: User[] = [{ id: '1', login: 'admin', password: 'admin', name: 'Admin' }];
      usersGatewayStub.login.mockReturnValue(defer(() => of(expectedUsers)));

      const result$ = authService.login('admin', 'admin');

      expect(usersGatewayStub.login).toHaveBeenCalledWith('admin', 'admin');
      result$.subscribe((users) => {
        expect(users).toEqual(expectedUsers);
      });
    });
  });

  describe('setUser', () => {
    it('should set the current user', () => {
      const user: User = { id: '1', login: 'admin', password: 'admin', name: 'Admin' };

      authService.setUser(user);

      expect(authService.currentUser()).toEqual(user);
      expect(authService.isLoggedIn()).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear the current user and navigate to /', () => {
      const user: User = { id: '1', login: 'admin', password: 'admin', name: 'Admin' };
      authService.setUser(user);

      authService.logout();

      expect(authService.currentUser()).toBeNull();
      expect(authService.isLoggedIn()).toBe(false);
      expect(routerStub.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('isLoggedIn', () => {
    it('should return false when no user is set', () => {
      const result = authService.isLoggedIn();

      expect(result).toBe(false);
    });

    it('should return true when a user is set', () => {
      authService.setUser({ id: '1', login: 'admin', password: 'admin', name: 'Admin' });

      const result = authService.isLoggedIn();

      expect(result).toBe(true);
    });
  });
});
