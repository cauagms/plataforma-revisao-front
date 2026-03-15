import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const professorGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = authService.usuario();

  if (usuario) {
    return usuario.role === 'professor' || router.createUrlTree(['/home']);
  }

  return authService.me().pipe(
    map((user) => {
      authService.usuario.set(user);
      return user.role === 'professor' || router.createUrlTree(['/home']);
    })
  );
};

export const alunoGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = authService.usuario();

  if (usuario) {
    return usuario.role === 'aluno' || router.createUrlTree(['/dashboard-professor']);
  }

  return authService.me().pipe(
    map((user) => {
      authService.usuario.set(user);
      return user.role === 'aluno' || router.createUrlTree(['/dashboard-professor']);
    })
  );
};
