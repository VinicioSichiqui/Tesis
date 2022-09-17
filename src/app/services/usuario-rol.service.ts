import { environment } from 'src/environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaServer } from '../models/response';
import { UsuarioRol } from '../models/usuario/usuarioRol';

@Injectable({
  providedIn: 'root'
})
export class UsuarioRolService {

  private _url: string = `${environment.baseUrl}/usuarioRol`;
  constructor(
    private _http: HttpClient
  ) { }

  usuariosRoles = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}`);
  }

  getPorId = (id: number): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/${id}`)
  }

  crear = (usuarioRol: UsuarioRol): Observable<RespuestaServer> => {
    return this._http.post<RespuestaServer>(`${this._url}`, usuarioRol);
  }

  actualizar = (id: number, usuarioRol: UsuarioRol): Observable<RespuestaServer> => {
    return this._http.put<RespuestaServer>(`${this._url}/${id}`, usuarioRol);
  }

  eliminar = (id: number): Observable<RespuestaServer> => {
    return this._http.delete<RespuestaServer>(`${this._url}/${id}`);
  }
}
