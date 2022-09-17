import { Injectable } from '@angular/core';
import { CanActivate,  Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MsgSweetAlertService } from '../services/msg-sweet-alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) {}
  canActivate(): Observable<boolean >| boolean  {
    if ( this._authService.isAuthenticated()) {
      if( this.isTokenExpired() ) {
        this._authService.logOut();
        this._msgSweetAlertService.mensajeAdvertencia('Oooops!', 'Sessión caducada');
        this._router.navigate(['/auth']);
        return false;
      }
      return true;
    }
    this._router.navigate(['/auth']);
    return false;
  }

  // verifica si el token expire
  isTokenExpired(): boolean {
    let token = this._authService.token;
    let payload = this._authService.obtenerDatosToken(token);
    // extraemos el tiempo actual en milisegundos
    let now = new Date().getTime() / 1000;
    // comparamos la fecha actual con el token guardado
    if (payload.exp < now) {
      return true;
    }
    return false;
  }
  
}
