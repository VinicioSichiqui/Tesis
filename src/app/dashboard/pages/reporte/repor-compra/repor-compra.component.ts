import { Component, OnInit } from '@angular/core';
import { Compra } from '../../../../models/compra/compra';
import { CompraService } from '../../../../services/compra.service';
import { ReporCompraService } from '../../../../services/reportes/repor-compra.service';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';
import { RespuestaServer } from '../../../../models/response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-repor-compra',
  templateUrl: './repor-compra.component.html',
  styleUrls: ['./repor-compra.component.css']
})
export class ReporCompraComponent implements OnInit {

  public compras: Compra [] = [];
  public loading: boolean = false;
  public fechaInicio?: Date | null;
  public fechaFin?: Date | null;
  public termino: string = '';
  constructor(
    private _compraService: CompraService,
    private _reporCompraService: ReporCompraService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) { }

  ngOnInit(): void {
    this.getCompras();
  }

  getCompras = () => {
    this.loading = true;
    this._compraService.comprasPorEstado().subscribe({
      next: ( resp: RespuestaServer ) => {
        this.compras = resp.respuesta;
        this.loading = false;
      },
      error: ( erro: HttpErrorResponse ) => {
        this.compras = []
        this.loading = false;
      }
    });
  }

  verificarTermino = () => {
    if(this.termino.length === 0) this.getCompras();
  }

  buscarPorTermino = () => {
    this.loading = true;
    if (this.termino.length > 0) {
      this._compraService.getPorCedulaTermino(this.termino.toLowerCase()).subscribe({
        next: (resp: RespuestaServer) => {
          this.compras = resp.respuesta;
          this.fechaInicio = null;
          this.fechaFin = null;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.getCompras();
            this._msgSweetAlertService.mensajeInfo('Upps!', 'No hay compras con ese proveedor');
          }else {
            this.getCompras();
          }
          this.termino = '';
          this.loading = false;
        }
      });
    }
  }
  
  getComprasPorFechas = () => {
    if (!this.fechaInicio) {
      this._msgSweetAlertService.mensajeInfo('Por favor..', 'Seleccione Fecha de inicio');
      return;
    } else if (!this.fechaFin) {
      this._msgSweetAlertService.mensajeInfo('Por favor..', 'Seleccione Fecha de fin');
      return;
    }
    this.loading = true;
    this._compraService.getPorFechas(this.fechaInicio!, this.fechaFin!).subscribe({
      next: ( resp: RespuestaServer ) => {
        this.compras = resp.respuesta;
        this.loading = false;
        this.termino = '';
      },
      error: (err: HttpErrorResponse) => {
        if ( err.status === 404 ) {
          this._msgSweetAlertService.mensajeInfo('Lo sentimos...', 'No existen compras con ese rango de fecha');
        } 
        this.compras = [];
        this.loading = false;
      },
    });    
  }

  generarPdf = () => {
    if( this.compras.length === 0 ){
      this._msgSweetAlertService.mensajeInfo('Lo sentimos', 'No hay compras para generar el Reporte');
      return;
    } else if (this.fechaInicio && this.fechaFin) {
      this._reporCompraService.generarPdf(this.compras, this.fechaInicio, this.fechaFin);
    } else if (this.termino.length>0) {
      this._reporCompraService.generarPdf(this.compras,null!,null!, this.termino);
    } else {
      this._reporCompraService.generarPdf(this.compras);
    }
  }

}
