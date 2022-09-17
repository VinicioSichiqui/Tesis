import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaServer } from '../models/response';
import { Compra } from '../models/compra/compra';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private _url: string = `${environment.baseUrl}/compra`;
  constructor(
    private _http: HttpClient
  ) { }

  compras = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}`);
  }

  comprasPorEstado = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}/estado`);
  }

  getPorId = (id: number): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/${id}`)
  }

  getPorTermino = (termino: string): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/buscar/${termino}`)
  }

  getPorCedulaTermino = (termino: string): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/buscar/ruc/${termino}`);
  }

  getPorFechas = (fechaInicio: Date, fechaFin: Date): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/fechas/${fechaInicio}/${fechaFin}`);
  }

  crear = (compra: Compra): Observable<RespuestaServer> => {
    return this._http.post<RespuestaServer>(`${this._url}`, compra);
  }

  actualizar = (id: number, compra: Compra): Observable<RespuestaServer> => {
    return this._http.put<RespuestaServer>(`${this._url}/${id}`, compra);
  }
  actualizarEstado = (id: number): Observable<RespuestaServer> => {
    return this._http.put<RespuestaServer>(`${this._url}/estado/${id}`, {});
  }
  eliminar = (id: number): Observable<RespuestaServer> => {
    return this._http.delete<RespuestaServer>(`${this._url}/${id}`);
  }
}
