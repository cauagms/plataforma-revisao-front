import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      const isLoginRequest = req.url.includes('/auth/login');
      const isOnLoginPage = router.url === '/login';

      if (error.status === 401 && !isLoginRequest && !isOnLoginPage) {
        authService.logout();
      }

      if (error.status === 403) {
        console.error('Acesso negado: você não tem permissão para acessar este recurso.');
      }

      return throwError(() => error);
    })
  );
};
