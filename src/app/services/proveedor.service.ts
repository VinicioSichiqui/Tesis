import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RespuestaServer } from '../models/response';
import { environment } from 'src/environments/environment.prod';
import { Proveedor } from '../models/proveedor/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private _url: string = `${environment.baseUrl}/proveedor`;
  constructor(
    private _http: HttpClient
  ) { }

  proveedores = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}`);
  }

  proveedoresPorEstado = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}/estado`);
  }

  getPorId = (id: number): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/${id}`)
  }

  getPorTermino = (termino: string): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/buscar/${termino}`)
  }

  crear = (proveedor: Proveedor): Observable<RespuestaServer> => {
    return this._http.post<RespuestaServer>(`${this._url}`, proveedor);
  }

  actualizar = (id: number, proveedor: Proveedor): Observable<RespuestaServer> => {
    return this._http.put<RespuestaServer>(`${this._url}/${id}`, proveedor);
  }
  actualizarEstado = (id: number): Observable<RespuestaServer> => {
    return this._http.put<RespuestaServer>(`${this._url}/estado/${id}`, {});
  }

  eliminar = (id: number): Observable<RespuestaServer> => {
    return this._http.delete<RespuestaServer>(`${this._url}/${id}`);
  }

}
