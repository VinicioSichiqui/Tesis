import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RespuestaServer } from '../models/response';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Venta } from '../models/venta/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private _url: string = `${environment.baseUrl}/venta`;

  constructor(
    private _http: HttpClient 
    ) { }
  
    ventas = (): Observable<RespuestaServer> => {    
      return this._http.get<RespuestaServer>(`${this._url}`);
    }
    ventasPorEstado = (): Observable<RespuestaServer> => {    
      return this._http.get<RespuestaServer>(`${this._url}/estado`);
    }
  
    getPorId = (id: number): Observable<RespuestaServer> => {
      return this._http.get<RespuestaServer>(`${this._url}/${id}`);
    }
    getUltimaVenta = (): Observable<RespuestaServer> => {
      return this._http.get<RespuestaServer>(`${this._url}/ultima`);
    }
  
    getPorTermino = (termino: string): Observable<RespuestaServer> => {
      return this._http.get<RespuestaServer>(`${this._url}/buscar/${termino}`);
    }
    getPorCedulaTermino = (termino: string): Observable<RespuestaServer> => {
      return this._http.get<RespuestaServer>(`${this._url}/buscar/cedula/${termino}`);
    }

    getPorFechas = (fechaInicio: Date, fechaFin: Date): Observable<RespuestaServer> => {
      return this._http.get<RespuestaServer>(`${this._url}/fechas/${fechaInicio}/${fechaFin}`);
    }
    crear = (ventas: Venta): Observable<RespuestaServer> => {
      return this._http.post<RespuestaServer>(`${this._url}`, ventas);
    }
    actualizar = (id: number, venta: Venta): Observable<RespuestaServer> => {
      return this._http.put<RespuestaServer>(`${this._url}/${id}`, venta);
    }
    actualizarFecha = (id: number, fecha: Date): Observable<RespuestaServer> => {
      return this._http.put<RespuestaServer>(`${this._url}/fecha/${id}`, fecha);
    }
    actualizarEstado = (id: number): Observable<RespuestaServer> => {
      return this._http.put<RespuestaServer>(`${this._url}/estado/${id}`, {});
    }
    eliminar = (id: number): Observable<RespuestaServer> => {
      return this._http.delete<RespuestaServer>(`${this._url}/${id}`);
    }
   
}
