import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MsgSweetAlertService } from '../services/msg-sweet-alert.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError( e => {
        // no esta autentificado
        if( e.status == 401 ){
          if ( this._authService.isAuthenticated() ) {
            this._authService.logOut();
          } 
          this._router.navigate(['/auth']);
        }
        // no tiene acceso a los endpoints
        if ( e.status == 403 ) {
          this._msgSweetAlertService.mensajeAdvertencia('No tienes acceso', 'Pide al administrador que te asigne un rol');
          this._router.navigate(['/dashboard']);
        }
        return throwError(e);
      })
    );
  }
}
