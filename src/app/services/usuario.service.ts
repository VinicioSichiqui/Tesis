import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaServer } from '../models/response';
import { Usuario } from '../models/usuario/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private _url: string = `${environment.baseUrl}/usuario`;
  constructor(
    private _http: HttpClient
  ) { }

  usuarios = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}`);
  }

  usuariosPorEstado = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}/estado`);
  }

  getPorId = (id: number): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/${id}`)
  }

  getPorTermino = (termino: string): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/buscar/${termino}`)
  }

  crear = (usuario: Usuario): Observable<RespuestaServer> => {
    return this._http.post<RespuestaServer>(`${this._url}`, usuario);
  }

  actualizar = (id: number, usuario: Usuario): Observable<RespuestaServer> => {
    return this._http.put<RespuestaServer>(`${this._url}/${id}`, usuario);
  }
  actualizarEstado = (id: number): Observable<RespuestaServer> => {
    return this._http.put<RespuestaServer>(`${this._url}/estado/${id}`, {});
  }

  eliminar = (id: number): Observable<RespuestaServer> => {
    return this._http.delete<RespuestaServer>(`${this._url}/${id}`);
  }
}
