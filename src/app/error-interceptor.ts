import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar, MatDialog } from '@angular/material'; // TODO: Replace with a better error specific approach.
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snacks: MatSnackBar, private dialog: MatDialog) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        let errorMessage = 'An unknown error has occured.';
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        // alert(error.error.error._message);
        // this.snacks.open(error.message, 'Dismiss', { duration: 1500 });
        this.dialog.open(
          ErrorComponent,
          {
            // hasBackdrop: false,
            autoFocus: false,
            closeOnNavigation: true,
            // position: { bottom: '0', left: '0' },
            data: { message: errorMessage }
          }
        );
        return throwError(error);
      })
    );
  }
}
