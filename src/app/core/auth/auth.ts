import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../features/me/domain/models/user';
import { UsersGateway } from '../../features/me/domain/gateways/users';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly usersGateway = inject(UsersGateway);

  private readonly _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = () => this._currentUser() !== null;

  login(login: string, password: string) {
    return this.usersGateway.login(login, password);
  }

  setUser(user: User): void {
    this._currentUser.set(user);
  }

  logout(): void {
    this._currentUser.set(null);
    this.router.navigate(['/']);
  }
}
