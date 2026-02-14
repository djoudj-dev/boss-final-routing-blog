import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { isLoggedInGuard } from './is-logged-in';
import { AuthService } from '../auth/auth';
import { UsersGateway } from '../../features/me/domain/gateways/users';

describe('isLoggedInGuard', () => {
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: UsersGateway, useValue: { login: vi.fn() } },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    });

    authService = TestBed.inject(AuthService);
  });

  it('should return false when user is not logged in', () => {
    const result = TestBed.runInInjectionContext(() =>
      isLoggedInGuard({} as any, [] as any)
    );

    expect(result).toBe(false);
  });

  it('should return true when user is logged in', () => {
    authService.setUser({ id: '1', login: 'admin', password: 'admin', name: 'Admin' });

    const result = TestBed.runInInjectionContext(() =>
      isLoggedInGuard({} as any, [] as any)
    );

    expect(result).toBe(true);
  });
});
