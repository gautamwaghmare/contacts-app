import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private _snackBar: MatSnackBar) {}

    intercept(req: HttpRequest<any>, next: HttpHandler){
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = "An unknown error occured!";
                if(error.error.message){
                    errorMessage = error.error.message;
                }
                this._snackBar.open(errorMessage, 'OK', {
                    duration: 5000
                });
                return throwError(error);
            })
        );
    }
}