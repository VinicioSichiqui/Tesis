import { Component, OnInit } from '@angular/core';
import { CompraService } from '../../../../services/compra.service';
import { RespuestaServer } from '../../../../models/response';
import { Venta } from '../../../../models/venta/venta';
import { VentaService } from '../../../../services/venta.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-listar-venta',
  templateUrl: './listar-venta.component.html',
  styleUrls: ['./listar-venta.component.css'],
  providers: [ConfirmationService]
})
export class ListarVentaComponent implements OnInit {
  public diaActual: Date = new Date();
  public ventas: Venta [] = [];
  public termino: string = '';
  public displayDetalles: boolean= false;
  public selectedVenta?: Venta| null;

  constructor(
    private _confirmationService: ConfirmationService,
    private _ventaService: VentaService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) { }

  ngOnInit(): void {
    this.listarVenta();
  }

  listarVenta = () => {
    this._ventaService.ventas().subscribe({
      next: ( resp : RespuestaServer ) => {        
        this.ventas = resp.respuesta as Venta[];                
      },
      error: (err) => this.ventas= []
    })
  }
  verificarTermino = () => {
    if(this.termino.length === 0) this.listarVenta();
  }

  buscarPorTermino = () => {
    if (this.termino.length > 0) {
      this._ventaService.getPorTermino(this.termino.toLowerCase()).subscribe({
        next: (resp: RespuestaServer) => {
          this.ventas = resp.respuesta;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.listarVenta();
            this._msgSweetAlertService.mensajeInfo('Upps!', 'No existe ventas con ese código');
          }else {
            this.listarVenta();
          }
          this.termino = '';
        }
      })
    }
  }

  eliminar = (event: Event, id: number) => {    
    this._confirmationService.confirm({
        target: event.target!,
        message: '¿Desea eliminar esta venta?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        accept: () => {
            this._ventaService.eliminar(id).subscribe({
              next: (resp: RespuestaServer) => {
                this._msgSweetAlertService.mensajeOk('Venta eliminada');
                this.listarVenta();
              }, 
              error: (err: HttpErrorResponse) => {
                this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo eliminar la venta');
              }
            });
        },
        reject: () => {
        }
    });
  }
  actualizarFecha = (fecha: Date, id: number) => {
    this._ventaService.actualizarFecha( id, fecha ).subscribe({
      next: ( resp: RespuestaServer ) => {
        this._msgSweetAlertService.mensajeOk('Fecha Actualizada');
      },
      error: (err) => {
        this._msgSweetAlertService.mensajeAdvertencia('Upps!', 'No se pudo cambiar la Fecha');
      }
    });
    
  }
  actualizarEstado = (venta: Venta) => {
    this._ventaService.actualizarEstado( venta.idVenta! ).subscribe({
      next: ( resp: RespuestaServer ) => {
        this._msgSweetAlertService.mensajeOk( venta.estadoVenta? 'La venta se encuentra disponible' : 'Venta dada de baja');
      },
      error: (err) => {
        this._msgSweetAlertService.mensajeAdvertencia('Upps!', 'No se pudo cambiar el estado');
      }
    });
  }
  showDialog = (venta: Venta) => {
    this.displayDetalles = true;
    this.selectedVenta= venta;
  }
  
  closeDialog = () => {
    this.displayDetalles = false;
    this.selectedVenta= null;
  }

}
