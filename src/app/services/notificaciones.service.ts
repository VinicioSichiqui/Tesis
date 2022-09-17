import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  public notificacionesMenu$ = new EventEmitter<MenuItem[]>();
  constructor(
    
  ) { 
  }

}
