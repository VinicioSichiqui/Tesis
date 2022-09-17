import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { RespuestaServer } from '../models/response';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private _url: string = `${environment.baseUrl}/cliente`;
  constructor(
    private _http: HttpClient
  ) { }

  clientes = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}`);
  }

  clientesPorEstado = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}/estado`);
  }

  getPorId = (id: number): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/${id}`)
  }

  getPorTermino = (termino: string): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/buscar/${termino}`)
  }

  crear = (cliente: Cliente): Observable<RespuestaServer> => {
    return this._http.post<RespuestaServer>(`${this._url}`, cliente);
  }

  actualizar = (id: number, cliente: Cliente): Observable<RespuestaServer> => {
    return this._http.put<RespuestaServer>(`${this._url}/${id}`, cliente);
  }
  actualizarEstado = (id: number): Observable<RespuestaServer> => {
    return this._http.put<RespuestaServer>(`${this._url}/estado/${id}`, {});
  }

  eliminar = (id: number): Observable<RespuestaServer> => {
    return this._http.delete<RespuestaServer>(`${this._url}/${id}`);
  }
}
