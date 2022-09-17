import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Usuario } from '../models/usuario/usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public nombreUsuario$ = new EventEmitter<Usuario>();
  private _usuario?: Usuario | null;
  private _token?: string | null;
  private _baseUrl: string = environment.urlAuth;
  constructor(
    private _http: HttpClient,
  ) { }

  public get usuario(): Usuario {
    if ( this._usuario != null ) {
      return this._usuario;
    } else if ( this._usuario == null && sessionStorage.getItem('usuario') != null ) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario') || '') as Usuario;      
      return this._usuario;
    }
    return new Usuario();
  }
  public get token(): string | null {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token') || '';
      return this._token;
    }
    return null;
  }

  logIn = ( cedula: string, password: string): Observable<any>=> {
    // credenciales del cliente   
    const credenciales = btoa(environment.credenciales);
    // las cabeceras de la peticion para login
    const headers = new HttpHeaders({
      'Content-Type' : 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + credenciales
    })

    // datos para la authentificacion
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', cedula);
    params.set('password', password);

    return this._http.post<any>(`${this._baseUrl}`, params.toString(), {headers});
  }

  guardarUsuario = ( access_token: string ): void => {
    let payload = this.obtenerDatosToken( access_token );
    let {id, nombres, apellidos, user_name , authorities} = payload;    
    this._usuario = new Usuario();
    this._usuario.idUsuario = id;
    this.usuario.persona = {cedulaPersona: user_name, nombresPersona: nombres, apellidosPersona: apellidos};
    this._usuario.roles = authorities;

    // guardamos en el sessionstorage
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  // guardamos token en el session storage
  guardarToken = (access_token: string): void => {
    this._token = access_token;
    sessionStorage.setItem('token', this._token);
  }

  obtenerDatosToken = ( access_token: string|null ) => {
    if( access_token !== null) {
      return JSON.parse(atob(access_token.split('.')[1]));
    }
    return null;
  }

  // verificamos loggeo
  isAuthenticated = (): boolean => {
    let payload = this.obtenerDatosToken(this.token);
    if ( payload !== null && payload.user_name && payload.user_name.length > 0 ) {
      return true;
    }
    return false;
  }

  // cerramos session
  logOut = (): void => {
    this._token = null;
    this._usuario = null;

    // borramos de la memoria
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    
  }

  // verificamos que contega el rol permitido
  hasRole = (role: string): boolean => {
    this._usuario = this.usuario;
    if ( this._usuario != null && this._usuario != undefined && this._usuario.roles!.includes(role)) {
      return true;
    }
    return false;
  }


}
