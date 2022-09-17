import { environment } from 'src/environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaServer } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private _url: string = `${environment.baseUrl}/rol`;
  constructor(
    private _http: HttpClient
  ) { }

  roles = (): Observable<RespuestaServer> => {    
    return this._http.get<RespuestaServer>(`${this._url}`);
  }
}
