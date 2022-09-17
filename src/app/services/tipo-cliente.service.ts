import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaServer } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class TipoClienteService {

  private _url: string = `${environment.baseUrl}/tipoCliente`;
  constructor(
    private _http: HttpClient
  ) { }

  tiposCliente = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}`);
  }
}
