import { Component, OnInit } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';

import { Producto } from '../../../../models/producto/producto';
import { DetalleVentaProducto } from '../../../../models/venta/detalleVentaProducto';
import { VentaService } from '../../../../services/venta.service';
import { RespuestaServer } from '../../../../models/response';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';
import { ProductoService } from '../../../../services/producto.service';
import { Cliente } from '../../../../models/cliente/cliente';
import { ClienteService } from '../../../../services/cliente.service';
import { Venta } from '../../../../models/venta/venta';
import { NotificacionesService } from '../../../../services/notificaciones.service';

@Component({
  selector: 'app-gestion-venta',
  templateUrl: './gestion-venta.component.html',
  styleUrls: ['./gestion-venta.component.css'],
  providers: [ConfirmationService]
})
export class GestionVentaComponent implements OnInit {

  public clientes: Cliente [] = [];
  public productos: Producto [] = [];
  public itemsVenta: DetalleVentaProducto [] = [];
  public showCliente?: Cliente | null;
  public showProducto?: Producto | null;

  public cantidad: number|string = '';
  public totalVenta: number = 0;
  public codVenta: string = '000'
  public venta?: Venta;
  public detalleVentaProducto: DetalleVentaProducto[] = [];
  public id?: number;
  public selectedVenta?: Venta;
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _productoService: ProductoService,
    private _clienteService: ClienteService,
    private _notificacionesService: NotificacionesService,
    private _ventaService: VentaService,
    private _msgSweetAlertService: MsgSweetAlertService,
  ) { }

  ngOnInit(): void {
    this.getProductos();
    this.getClientes();
    this.getUltimaVenta();
    this.getVentaIdParam();
  }

  getProductos = () => this._productoService.productosPorEstado().subscribe({
    next: (resp: RespuestaServer) => this.productos = resp.respuesta,
    error: (err: HttpErrorResponse) => console.log(err)
  });
  getClientes = () => this._clienteService.clientesPorEstado().subscribe({
    next: (resp: RespuestaServer) => this.clientes = resp.respuesta,
    error: (err: HttpErrorResponse) => console.log(err)
  });

  getUltimaVenta = () => this._ventaService.getUltimaVenta().subscribe({
    next: (resp: RespuestaServer) => {
      let venta: Venta = resp.respuesta;
      this.codVenta='000';
      this.codVenta += ( venta.idVenta! + 1)?.toString();      
    },
    error: (err: HttpErrorResponse) => {
      if (err.status === 404) {
        this.codVenta = '0001'
      }
    }
  });

  getVentaIdParam = () => {
    this._activatedRoute.paramMap.subscribe( params => {      
      this.id = +params.get('id')!;
      if ( this.id && !isNaN(this.id)) {
        this.productos = [];
        this.getVentaPorId( this.id );
      } else {
        this._router.navigate(['/dashboard/venta/gestion/crear']);
      }
    });
  }

  getVentaPorId = (id: number) => {
    this._ventaService.getPorId(id).subscribe({
      next: (resp: RespuestaServer) => {
        this.selectedVenta = resp.respuesta;
        this.itemsVenta = this.selectedVenta?.items!;
        this.productos = this.itemsVenta.map( item => item.producto!);
        console.log(this.itemsVenta);
        
        this.showCliente = this.selectedVenta?.cliente;
        this.codVenta = this.selectedVenta?.codigoVenta!;
        this.calcularTotalFooter();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo encontrar esa venta',);
          this._router.navigate(['/dashboard/venta']);
        }
      }
    });
  }
  
  mostrarNombre = (): string => {
    if (this.showCliente) {
      return `${this.showCliente?.persona?.nombresPersona} ${this.showCliente?.persona?.apellidosPersona}`
    }
    return ''
  }


  agregarItem = () => {
    if (this.cantidad > 0 && this.showProducto) {
      let itemVenta: DetalleVentaProducto = {};
      if (this.verificarStockProducto()) {        
        return;
      }
      itemVenta!.cantidadDetalleProductoVenta = +this.cantidad;
      itemVenta!.precioDetalleProductoVenta = this.showProducto?.precioVentaProducto;
      itemVenta!.totalDetalleProductoVenta = +(+this.cantidad * this.showProducto?.precioVentaProducto!).toFixed(2);
      itemVenta!.producto = this.showProducto!;
      if (this.existeItem(this.showProducto.idProducto!)) {
        this.incrementaCantidad(this.showProducto.idProducto!);
      } else {
        this.itemsVenta.push(itemVenta);
        this.actualizarStockArrarProd();
      }
      this.calcularTotalFooter();
      this.showProducto = null;
      this.cantidad = '';
    } else {
      this.showProducto ?
      this._msgSweetAlertService.mensajeInfo('Por favor', 'Ingrese una catidad mayor a 0')
      :
      this._msgSweetAlertService.mensajeInfo('Por favor', 'Seleccione el producto');
    }
  }

  verificarStockProducto = (): boolean => {
    if (this.showProducto?.stockProducto! < this.cantidad) {
      this._msgSweetAlertService.mensajeAdvertencia('Upss!', `Stock insuficiente, solo hay ${this.showProducto?.stockProducto} en Stock`);
      return true;
    } 
    return false
  }

  existeItem = ( id :  number):boolean => {
    let existe = false;
    this.itemsVenta.forEach((item: DetalleVentaProducto) => {
      if ( id === item.producto?.idProducto) {
        existe = true;
      }
    });
    return existe;
  }
  
  incrementaCantidad = ( id :  number): void => {
    this.itemsVenta = this.itemsVenta.map((item: DetalleVentaProducto) => {
      if ( id === item.producto?.idProducto) {
        item.cantidadDetalleProductoVenta! += +this.cantidad;
        item.totalDetalleProductoVenta! = +(item.cantidadDetalleProductoVenta! * this.showProducto?.precioVentaProducto!).toFixed(2);
        this.actualizarStockArrarProd();
      }
      return item;
    });
  }

  actualizarStockArrarProd = () => {
    this.productos= this.productos.map( prod => {
      if (prod.idProducto === this.showProducto?.idProducto) {
        prod.stockProducto! -= +this.cantidad; 
        return prod;
      }
      return prod;
    });
  }

  actualizarStockArrarProdEliminado = (id: number, cantidad: number) => {
    this.productos= this.productos.map( prod => {
      if (prod.idProducto === id) {
        prod.stockProducto! += cantidad;         
        return prod;
      }
      return prod;
    });
  }

  calcularTotalFooter  = () => {
    this.totalVenta = 0
    for (const item of this.itemsVenta) {
      this.totalVenta += item.totalDetalleProductoVenta!;
    }
    this.totalVenta = +this.totalVenta.toFixed(2);
  }

  quitarProductoItem = (id: number) => {
    let cantidad: number = this.itemsVenta.find( item => item.producto?.idProducto === id)?.cantidadDetalleProductoVenta!;
    this.itemsVenta = this.itemsVenta.filter( detalle => detalle.producto?.idProducto != id);
    this.actualizarStockArrarProdEliminado(id, cantidad);
    this.calcularTotalFooter();
  }

  realizarAccion = () => {
    if (this.showCliente && this.itemsVenta.length > 0) {
      if (this.id) {
        this.actualizarVenta();
      } else {
        this.crearVenta();
      }
    } else {
      !this.showCliente ?
        this._msgSweetAlertService.mensajeInfo('Por favor','Seleccione un cliente')
      : 
        this._msgSweetAlertService.mensajeInfo('Por favor', 'Ingrese al menos 1 producto');
    }
  }

  crearVenta = () => {
    this.venta = {
      cliente: this.showCliente!,
      codigoVenta: this.codVenta,
      estadoVenta: true,
      formaPago: {idFormaPago: 1},
      fechaVenta: new Date(),
      totalVenta: this.totalVenta,
      items:this.itemsVenta
    };
    this._ventaService.crear(this.venta).subscribe({
      next: ( resp: RespuestaServer ) => {
        this.limpiar();
        this._msgSweetAlertService.mensajeOk('Venta realizada');
        this.getUltimaVenta();
        // para las notifi
        this._notificacionesService.notificacionesMenu$.emit();
      },
      error: ( err: HttpErrorResponse ) => {
        if (err.status === 409) {
          this._msgSweetAlertService.mensajeAdvertencia('Upss!', 'Código  de la venta repetido');
          this.codVenta = (+this.codVenta +1).toString();
        } else {
          this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo guardar la venta');
        }
      }
    });
  }
  // TODO: Realizar bien el actualizar de un item
  // TODO: si no es posible agregar mensaje de info
  actualizarVenta = () => {
    this.selectedVenta = {
      cliente: this.showCliente!,
      codigoVenta: this.codVenta,
      estadoVenta: this.selectedVenta?.estadoVenta,
      formaPago: this.selectedVenta?.formaPago,
      fechaVenta: this.selectedVenta?.fechaVenta,
      totalVenta: this.totalVenta,
      items: this.itemsVenta
    };
    console.log(this.selectedVenta);
    
    this._ventaService.actualizar(this.id!, this.selectedVenta!).subscribe({
      next: (resp: RespuestaServer) => {
        this._msgSweetAlertService.mensajeOk('Venta Guardada');
        // para las notifi
        this._notificacionesService.notificacionesMenu$.emit();
        this._router.navigate(['/dashboard/venta']);
      }, 
      error: (err: HttpErrorResponse) => {
        console.log(err);
        
        if (err.status === 409) {
          this._msgSweetAlertService.mensajeAdvertencia('Upss!', 'Código  de la venta repetido');
          return;
        } else if(err.status === 404){
          this._msgSweetAlertService.mensajeError('Upss!', 'Esa venta no existe');
          this._router.navigate(['/dashboard/venta']);
        } 
        this._msgSweetAlertService.mensajeError('Upss!', 'No se pudo actualizar la venta');
        this._router.navigate(['/dashboard/venta']);
      }
    });
  }
  limpiar = () => {
    this.itemsVenta = [];
    this.showProducto = null;
    this.showCliente = null;
    this.cantidad = '';
    this.totalVenta = 0;
  }

  regresarPagina = () => window.history.back();

}
