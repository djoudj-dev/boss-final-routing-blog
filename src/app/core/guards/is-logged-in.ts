import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../auth/auth';

export const isLoggedInGuard: CanMatchFn = () => {
  const auth = inject(AuthService);

  return auth.isLoggedIn();
};
