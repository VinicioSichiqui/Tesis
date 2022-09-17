import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { Producto } from '../models/producto/producto';
import { RespuestaServer } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private _url: string = `${environment.baseUrl}/producto`;
  constructor(
    private _http: HttpClient
  ) { }

  productos = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}`);
  }

  productosSinStock = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}/stock`);
  }
  
  productosPorEstado = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}/estado`);
  }
  productosMenuCliente = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}/menu/cliente`);
  }
  productosDestacados = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}/menu/destacado`);
  }

  getPorId = (id: number): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/${id}`);
  }

  getPorTermino = (termino: string): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/buscar/${termino}`);
  }
  getPorTerminoAndEstado = (termino: string): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/buscar/estado/${termino}`);
  }
  getPorFechas = (fechaInicio: Date, fechaFin: Date): Observable<RespuestaServer> => {
    return this._http.get<RespuestaServer>(`${this._url}/fechas/${fechaInicio}/${fechaFin}`);
  }

  crear = (producto: Producto): Observable<RespuestaServer> => {
    return this._http.post<RespuestaServer>(`${this._url}`, producto);
  }

  actualizar = (id: number, producto: Producto): Observable<RespuestaServer> => {
    return this._http.put<RespuestaServer>(`${this._url}/${id}`, producto);
  }
  actualizarEstado = (id: number): Observable<RespuestaServer> => {
    return this._http.put<RespuestaServer>(`${this._url}/estado/${id}`, {});
  }
  actualizarEstadoMenu = (id: number): Observable<RespuestaServer> => {
    return this._http.put<RespuestaServer>(`${this._url}/menu/${id}`, {});
  }
  actualizarEstadoDestacar = (id: number): Observable<RespuestaServer> => {
    return this._http.put<RespuestaServer>(`${this._url}/destacar/${id}`, {});
  }

  subirFoto = (archivo: File, id: number): Observable<RespuestaServer> => {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id.toString());
    // const req = new HttpRequest('POST',`${this._url}/upload`, formData);
    return this._http.post<RespuestaServer>(`${this._url}/upload`, formData);
  }

  eliminar = (id: number): Observable<RespuestaServer> => {
    return this._http.delete<RespuestaServer>(`${this._url}/${id}`);
  }
}
