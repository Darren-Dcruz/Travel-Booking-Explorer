import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  if (req.headers.has('X-Skip-Error')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const fallbackMessage = `Request failed (${error.status || 'network'}). Please try again.`;
        const errorMessage =
          typeof error.error === 'string'
            ? error.error
            : typeof error.error?.message === 'string'
              ? error.error.message
              : fallbackMessage;

        notifications.error(errorMessage);
      } else {
        notifications.error('Unexpected error occurred. Please retry.');
      }

      return throwError(() => error);
    }),
  );
};
