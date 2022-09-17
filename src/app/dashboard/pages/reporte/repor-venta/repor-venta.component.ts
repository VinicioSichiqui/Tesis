import { Component, OnInit } from '@angular/core';
import { Venta } from '../../../../models/venta/venta';
import { VentaService } from '../../../../services/venta.service';
import { ReporVentaService } from '../../../../services/reportes/repor-venta.service';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';
import { RespuestaServer } from '../../../../models/response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-repor-venta',
  templateUrl: './repor-venta.component.html',
  styleUrls: ['./repor-venta.component.css']
})
export class ReporVentaComponent implements OnInit {
  public ventas: Venta [] = [];
  public loading: boolean = false;
  public fechaInicio?: Date | null;
  public fechaFin?: Date | null;
  public termino: string = '';
  constructor(
    private _ventaService: VentaService,
    private _reporVentaService: ReporVentaService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) { }

  ngOnInit(): void {
    this.getVentas();
  }

  getVentas = () => {
    this.loading = true;
    this._ventaService.ventasPorEstado().subscribe({
      next: ( resp: RespuestaServer ) => {
        this.ventas = resp.respuesta;
        console.log(resp);
        
        this.loading = false;
      },
      error: ( erro: HttpErrorResponse ) => {
        this.ventas = []
        this.loading = false;
      }
    });
  }

  verificarTermino = () => {
    if(this.termino.length === 0) this.getVentas();
  }

  buscarPorTermino = () => {
    this.loading = true;
    if (this.termino.length > 0) {
      this._ventaService.getPorCedulaTermino(this.termino.toLowerCase()).subscribe({
        next: (resp: RespuestaServer) => {
          this.ventas = resp.respuesta;
          this.fechaInicio = null;
          this.fechaFin = null;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.getVentas();
            this._msgSweetAlertService.mensajeInfo('Upps!', 'No hay ventas con ese cliente');
          }else {
            this.getVentas();
          }
          this.termino = '';
          this.loading = false;
        }
      });
    }
  }
  
  getVentasPorFechas = () => {
    if (!this.fechaInicio) {
      this._msgSweetAlertService.mensajeInfo('Por favor..', 'Seleccione Fecha de inicio');
      return;
    } else if (!this.fechaFin) {
      this._msgSweetAlertService.mensajeInfo('Por favor..', 'Seleccione Fecha de fin');
      return;
    }
    this.loading = true;
    this._ventaService.getPorFechas(this.fechaInicio!, this.fechaFin!).subscribe({
      next: ( resp: RespuestaServer ) => {
        this.ventas = resp.respuesta;
        this.loading = false;
        this.termino = '';
      },
      error: (err: HttpErrorResponse) => {
        if ( err.status === 404 ) {
          this._msgSweetAlertService.mensajeInfo('Lo sentimos...', 'No existen ventas con ese rango de fecha');
        } 
        this.ventas = [];
        this.loading = false;
      },
    });    
  }

  generarPdf = () => {
    if( this.ventas.length === 0 ){
      this._msgSweetAlertService.mensajeInfo('Lo sentimos', 'No hay ventas para generar el Reporte');
      return;
    } else if (this.fechaInicio && this.fechaFin) {
      this._reporVentaService.generarPdf(this.ventas, this.fechaInicio, this.fechaFin);
    } else if (this.termino.length>0) {
      this._reporVentaService.generarPdf(this.ventas,null!,null!, this.termino);
    } else {
      this._reporVentaService.generarPdf(this.ventas);
    }
  }

}
