import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.isLoggedIn$.pipe(
    map((isLoggedIn) => (isLoggedIn ? true : router.createUrlTree(['/register']))),
  );
};
