import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaServer } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {
  private _url: string = `${environment.baseUrl}/formaPago`;
  constructor(
    private _http: HttpClient
  ) { }

  formasPago = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}`);
  }
}
