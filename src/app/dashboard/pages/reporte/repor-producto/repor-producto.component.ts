import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../../services/producto.service';
import { Producto } from '../../../../models/producto/producto';
import { RespuestaServer } from '../../../../models/response';
import { HttpErrorResponse } from '@angular/common/http';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';
import { ReporProductoService } from '../../../../services/reportes/repor-producto.service';

@Component({
  selector: 'app-repor-producto',
  templateUrl: './repor-producto.component.html',
  styleUrls: ['./repor-producto.component.css']
})
export class ReporProductoComponent implements OnInit {
  public productos: Producto [] = [];
  public cols: any[] = [];
  public loading: boolean = false;
  public fechaInicio?: Date | null;
  public fechaFin?: Date | null;
  public termino: string = '';
  constructor(
    private _productoService: ProductoService,
    private _reporProductoService: ReporProductoService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) { }

  ngOnInit(): void {
    this.getProductos();
    this.cargarEncabezado();
  }

  cargarEncabezado = () => this.cols = [
      { field: 'codigoProducto',      header: 'Código' },
      { field: 'descripcionProducto', header: 'Nombre' },
      { field: 'fechaIngreso',        header: 'Fecha Ingreso' },
      { field: 'precioVentaProducto', header: 'Precio' },
      { field: 'stockProducto',       header: 'Stock' },
  ];

  getProductos = () => {
    this.loading = true;
    this._productoService.productosPorEstado().subscribe({
      next: ( resp: RespuestaServer ) => {
        this.productos = resp.respuesta;
        this.loading = false;
      },
      error: ( error: HttpErrorResponse ) => {
        this.productos = [];
        this.loading = false;
      }
    });
  }

  verificarTermino = () => {
    if(this.termino.length === 0) this.getProductos();
  }

  buscarPorTermino = () => {
    this.loading = true;
    if (this.termino.length > 0) {
      this._productoService.getPorTermino(this.termino.toLowerCase()).subscribe({
        next: (resp: RespuestaServer) => {
          this.productos = resp.respuesta;
          this.fechaInicio = null;
          this.fechaFin = null;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.getProductos();
            this._msgSweetAlertService.mensajeInfo('Upps!', 'No hay productos con ese nombre');
          }else {
            this.getProductos();
          }
          this.termino = '';
          this.loading = false;
        }
      });
    }
  }
  
  getProductosPorFechas = () => {
    if (!this.fechaInicio) {
      this._msgSweetAlertService.mensajeInfo('Por favor..', 'Seleccione Fecha de inicio');
      return;
    } else if (!this.fechaFin) {
      this._msgSweetAlertService.mensajeInfo('Por favor..', 'Seleccione Fecha de fin');
      return;
    }
    this.loading = true;
    this._productoService.getPorFechas(this.fechaInicio!, this.fechaFin!).subscribe({
      next: ( resp: RespuestaServer ) => {
        this.productos = resp.respuesta;
        this.loading = false;
        this.termino = '';
      },
      error: (err: HttpErrorResponse) => {        
        if ( err.status === 404 ) {
          this._msgSweetAlertService.mensajeInfo('Lo sentimos...', 'No existen productos con ese rango de fecha');
        } 
        this.productos = [];
        this.loading = false;
      },
    });    
  }

  generarPdf = () => {
    if( this.productos.length === 0 ){
      this._msgSweetAlertService.mensajeInfo('Lo sentimos', 'No hay productos para generar el Reporte');
      return;
    } else if (this.fechaInicio && this.fechaFin) {
      this._reporProductoService.generarPdf(this.productos, this.fechaInicio, this.fechaFin);
    } else if (this.termino.length>0) {
      this._reporProductoService.generarPdf(this.productos,null!,null!, this.termino);
    } else {
      this._reporProductoService.generarPdf(this.productos);
    }
  }
}
