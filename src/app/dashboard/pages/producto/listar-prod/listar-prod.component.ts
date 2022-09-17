import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Producto } from '../../../../models/producto/producto';
import { ProductoService } from '../../../../services/producto.service';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';
import { RespuestaServer } from './../../../../models/response';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-listar-prod',
  templateUrl: './listar-prod.component.html',
  styleUrls: ['./listar-prod.component.css']
})
export class ListarProdComponent implements OnInit {
  public productos: Producto [] = [];

  public termino: string = '';

  public displayDetalles: boolean= false;
  public displayCustom: boolean = false;

  public selectedProducto?: Producto | null;


  public baseUrl: string = `${environment.baseUrl}/uploads/img`;
  public urlNoImage: string = `${environment.UlrNoImage}images/no-image.jpg`;

  constructor(
    private _productoService: ProductoService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) { }

  ngOnInit(): void {
    this.listarProductos();    
  }

  listarProductos = () => {
    this._productoService.productos().subscribe({
      next: ( resp : RespuestaServer ) => {        
        this.productos = resp.respuesta as Producto[];        
      },
      error: (err) => this.productos = []
    })
  }

  verificarTermino = () => {
    if(this.termino.length === 0) this.listarProductos();
  }

  buscarPorTermino = () => {
    if (this.termino.length > 0) {
      this._productoService.getPorTermino(this.termino.toLowerCase()).subscribe({
        next: (resp: RespuestaServer) => {
          this.productos = resp.respuesta;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.listarProductos();
            this._msgSweetAlertService.mensajeInfo('Upps!', 'No hay productos con ese nombre');
          }else {
            this.listarProductos();
          }
          this.termino = '';
        }
      });
    }
  }

  actualizarEstado = (producto: Producto) => {
    this._productoService.actualizarEstado( producto.idProducto! ).subscribe({
      next: ( resp: RespuestaServer ) => {
        this._msgSweetAlertService.mensajeOk( producto.estadoProducto ? 'El producto se encuentra disponible' : 'Producto dado de baja');
      },
      error: (err) => {
        this._msgSweetAlertService.mensajeAdvertencia('Upps!', 'No se pudo cambiar el estado');
      }
    })
  }

  imageClick( producto: Producto ) {
    this.displayCustom = true;
    this.selectedProducto = producto;
  }
  showDialog = (producto: Producto) => {
    this.displayDetalles = true;
    this.selectedProducto = producto;
  }
  
  closeDialog = () => {
    this.displayDetalles = false;
    this.displayCustom = false;
    this.selectedProducto = null;
  }

}
